import { Query } from "appwrite";
import {Client,Account,ID, Databases,Permission,Role} from "appwrite"

export class AuthService{
      client = new Client();
      account;
      databases;

      constructor(){
            this.client
                  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
                  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
            
            this.account = new Account(this.client);
            this.databases = new Databases(this.client);
            
      }

      async loginWithGoogle() {
            return this.account.createOAuth2Session(
                  "google",
                  import.meta.env.VITE_APP_SUCCESS_URL,
                  import.meta.env.VITE_APP_FAILURE_URL,
            );
      }

      async createAccount({email,password,name,role = 'user'}){
            try{
                  const userAccount = await this.account.create(ID.unique(),email,password,name);
                  
                  const session = await this.login({email,password});
                  
                  const userDoc = await this.databases.createDocument(
                        import.meta.env.VITE_APPWRITE_DATABASE_ID,
                        import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
                        ID.unique(),
                        {
                        userId: userAccount.$id,
                        role: role,
                        },
                        [
                        Permission.read(Role.user(userAccount.$id)),
                        Permission.write(Role.user(userAccount.$id)),
                        ]
                  );

                  return userDoc;

            }catch(error){
                  console.error(error.message);
            }
      }

      async login({email,password}){
            try {
                  return await this.account.createEmailPasswordSession(email,password);
            } catch (error) {
                  console.error(error.message);
            }
      }

      async getCurrentUser(){
            try {
                  return await this.account.get();
            } catch (error) {
                  console.error(error.message);
            }
      }

      async logout(){
            try {
                  await this.account.deleteSessions();
            } catch (error) {
                  console.error(error.message);
            }
      }

      async getUserRole(){
            try {
                  
                  const currentUser = await this.account.get();
                  const userId = currentUser.$id;
                  const res = await this.databases.listDocuments(
                  import.meta.env.VITE_APPWRITE_DATABASE_ID,
                  import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
                  [Query.equal('userId', userId)]
            );

                  if (res.documents.length > 0) {
                        return res.documents[0].role;
                  } else {
                        return null;
                  }

            } catch (error) {
                  console.error(error.message);
            }
      }
}

const authService = new AuthService();

export default authService;