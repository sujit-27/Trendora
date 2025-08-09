import { Client,Storage,Databases,Permission,Role, ID, Query } from "appwrite";
import authService from "./auth";
import { toast } from "react-toastify";

export class Service{
    client = new Client();
    databases;
    storage;

    constructor(){
        this.client
                  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
                  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
            
    }

    async uploadImage(file) {
        try {
            console.log(file);
            
            if (!file) throw new Error("No file selected");

            const uploadedImage = await this.storage.createFile(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            ID.unique(),
            file
            );

        return uploadedImage;
        } catch (error) {
             console.error("Image upload failed: " + error.message);
        }
    }


    async createProduct({ Title, description, price, category, image, inStock, userId }) {
        try {
            const role = await authService.getUserRole(userId);        

        if (!image) {
            throw new Error("Image upload failed");
        }

        return await this.databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            ID.unique(),
            {
                Title,
                description,
                price,
                category,
                image,
                inStock,
                userId,
            }
        );
        } catch (error) {
            console.error(error.message);
        }
    }

    async createBlog({ Topic, title, description,date,image, userId }) {
        try {
            const role = await authService.getUserRole(userId);        

        if (!image) {
            throw new Error("Image upload failed");
        }

        return await this.databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_BLOGS_COLLECTION_ID,
            ID.unique(),
            {
                Topic,
                title,
                description,
                date,
                image,
                userId,
            }
        );
        } catch (error) {
            console.error(error.message);
        }
    }

    async listBlogs(){
        try {
            const response = await this.databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_BLOGS_COLLECTION_ID,
            );
            return response.documents
        } catch (error) {
            throw error;
        }
    }


    async updateProduct(userId,Document_ID,{Title,description,price,category,image,inStock}){
        try {
            const role = await authService.getUserRole(userId);

            if (role !== 'admin') {
            throw new Error("Unauthorized: Only admins can update products");
            }

            return await this.databases.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                Document_ID,
                {
                    Title,
                    description,
                    price,
                    category,
                    image,
                    inStock,
                }
            )
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(Document_ID){
        try{
            const userId = (await authService.getCurrentUser()).$id;
            const role = await authService.getUserRole(userId);

            if (role !== 'admin') {
            throw new Error("Unauthorized: Only admins can delete products");
            }

            return await this.databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                Document_ID,
            )
        }catch (error){
            throw error;
        }
    }

    // async readproduct(Document_ID){
    //     try {
    //         return await this.databases.getDocument(
    //             import.meta.env.VITE_APPWRITE_DATABASE_ID,
    //             import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    //             Document_ID,
    //         )
    //     } catch (error) {
    //         console.error(error.message);
    //     }
    // }

    async readproduct(Document_ID) {
        try {
            // First fetch the main product document by ID
            const doc = await this.databases.getDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            Document_ID,
            );

            if (!doc) return null;

            const allSameTitleDocs = await this.databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            [
                Query.equal('Title', doc.Title),
                Query.limit(50),
            ],
            );

            const imageUrlsArr = await Promise.all(
            allSameTitleDocs.documents.map(d => (d.image ? this.getImageUrl(d.image) : null))
            );

            const uniqueImageUrls = [...new Set(imageUrlsArr.filter(Boolean))];

            return {
            ...doc,
            imageUrls: uniqueImageUrls.length ? uniqueImageUrls : [],
            };

        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    async listProducts(limit, offset) {
        try {
            const response = await this.databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            [],
            limit,
            offset
            );

            const imageUrlsArr = await Promise.all(
            response.documents.map(doc => this.getImageUrl(doc.image))
            );

            const groupedProducts = {};
            response.documents.forEach((doc, i) => {
            const Title = doc.Title;
            const imageUrl = imageUrlsArr[i];

            if (!groupedProducts[Title]) {
                groupedProducts[Title] = {
                ...doc,
                imageUrls: [imageUrl],
                };
            } else {
                groupedProducts[Title].imageUrls.push(imageUrl);
            }
            });

            return {
            products: Object.values(groupedProducts),
            total: response.total,
            };

        } catch (error) {
            console.error("Error fetching products:", error);
            return { products: [], total: 0 };
        }
    }

    async getImageUrl(fileId) {
        try {
            const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
            if (!fileId) throw new Error("No file ID provided");

            const imgurl = this.storage.getFileView(bucketId, fileId);
            
            return imgurl;
        } catch (error) {
            console.error("Error getting image:", error.message);
            return null;
        }
    }

    async getAllProducts(batchLimit = 100) {
        try {
            let allDocs = [];
            let offset = 0;
            let hasMore = true;

            while (hasMore) {
            const response = await this.databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [Query.limit(batchLimit), Query.offset(offset)]
            );

            allDocs = allDocs.concat(response.documents);

            hasMore = response.documents.length === batchLimit;
            offset += batchLimit;

            if (response.documents.length === 0) break;
            }

            const imageUrlsArr = await Promise.all(
            allDocs.map(doc => this.getImageUrl(doc.image))
            );

            const groupedProducts = {};
            allDocs.forEach((doc, i) => {
            const Title = doc.Title || 'Untitled';
            const imageUrl = imageUrlsArr[i];


            if (!groupedProducts[Title]) {
                groupedProducts[Title] = {
                ...doc,
                imageUrls: [imageUrl],
                ids: [doc.$id],
                };
            } else {
                groupedProducts[Title].imageUrls.push(imageUrl);
                groupedProducts[Title].ids.push(doc.$id);
            }
            });

            return Object.values(groupedProducts);

        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }

    async getAllBlogs() {

        try{
            const response = await this.databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_BLOGS_COLLECTION_ID,
            );

            const blogs = await Promise.all(
            response.documents.map(async (doc) => ({
                ...doc,
                imageUrl: await this.getImageUrl(doc.image),
            }))
        );

        return blogs;

        } 
        catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }

    async addToCart({product,quantity}) {
        try {
            const user = await authService.getCurrentUser();
            const userId = user.$id;
            const productId = product.$id;

            const existingItems = await this.databases.listDocuments(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID, [
            Query.equal('userId', userId),
            Query.equal('productId', productId),
            ]);

            if (existingItems.documents.length > 0) {
                const doc = existingItems.documents[0];
                const updatedQuantity = doc.quantity + quantity;
                return await this.databases.updateDocument(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID, doc.$id, {
                    quantity: updatedQuantity,
                });
            }else{
                return await this.databases.createDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID,
                    ID.unique(),
                    {
                    userId,
                    productId,
                    quantity,
                    }
                );
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    async updateQuantity({ docId, quantity }) {
        return await this.databases.updateDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID,
            docId, 
            { quantity }
        );
    }

    async removeFromCart(productId) {
    try {
        return this.databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID,
        productId
        );
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
    }

    
    async fetchCartItems() {
        try {
            const user = await authService.getCurrentUser();
            const userId = user.$id;
            const response = await this.databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID,
                [Query.equal('userId', userId)]
            );

            return response.documents;

        } catch (error) {
        console.error('Error fetching cart items:', error);
        }
    }

    async addToWishlist({ userId, productId }) {
    try {
        const existing = await this.databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_WISHLIST_COLLECTION_ID,
        [
            Query.equal('userId', userId),
            Query.equal('productId', productId)
        ]
        );

        if (existing.documents.length === 0) {
        const response = await this.databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_WISHLIST_COLLECTION_ID,
            ID.unique(),
            {
            userId,
            productId
            }
        );
        return response; // New entry added
        }

        // 3. If already exists, return the existing one
        return existing.documents[0];

    } catch (error) {
        console.error("Error adding to Wishlist:", error);
        throw new Error("Could not add to wishlist");
    }
    }


    async removeFromWishlist(docId){
        try {
            return await this.databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_WISHLIST_COLLECTION_ID,
                docId,
            );
        } catch (error) {
            console.error("Error removing from Wishlist:",error.message);
        }
    }

    async fetchWishlist(userId){
        try {
            const res = await this.databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_WISHLIST_COLLECTION_ID,
                [Query.equal('userId', userId)]
            );
            return res.documents;
        } catch (error) {
            console.error("Error fetching Wishlist products: ",error.message);
        }
    }

    async fetchUserAddressById(){
        try {
            const user = await authService.getCurrentUser();
            const userId = user.$id;

            const response = await this.databases.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
                [Query.equal("userId", userId)]
            );

            if (response.documents.length > 0) {
                return response.documents[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching Address: ",error);
        }
    }

    async createOrder(orderData) {
        try {
            const response = await this.databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
            ID.unique(),
            orderData
            );
            return response;
        } catch (error) {
            console.error("Failed to create order:", error);
            throw error;
        }
    }

    async updateOrder(orderId, updatedData) {
        try {
            const res = await this.databases.updateDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
            orderId,
            updatedData
            );
            return res;
        } catch (error) {
            console.error("Failed to update order:", error);
            throw error;
        }
    }

    async fetchOrders(){
        try {
            const user = await authService.getCurrentUser();
            const userId = user.$id;

            const response = await this.databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
            [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
            );
            return response.documents;
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            return [];
        }
    };
}

const service = new Service();

export default service;