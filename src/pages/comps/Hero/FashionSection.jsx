import React from 'react'
import Women from "@/assets/posters/women.avif"
import Men from "@/assets/posters/men.avif"
import Accessories from "@/assets/posters/accessories.jpg"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const FashionSection = () => {

    const navigate = useNavigate();

    return (
        <>
        <div className='max-w-6xl mx-auto my-5'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 sm:h-[400px]'>
                <div className='mt-3 sm:hidden'>
                    <div 
                    style={{
                                fontFamily: '"Style Script", cursive',
                                fontWeight: 900,
                                fontStyle: 'normal'
                            }} 
                    className='font-black text-4xl font-script text-center'>Fashion Section</div>
                    </div>
                    <div className="flex items-center space-x-2 justify-center mt-2 sm:hidden">
                        <div className="flex space-x-1">
                            <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                            <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                            <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                        </div>
                    <div className="flex h-1 w-25 bg-purple-500 rounded-full"></div>
                </div>
                <section className='relative bg-white rounded-[5px] shadow-lg m-2 overflow-hidden h-[350px]'>
                    <img
                        src={Women}
                        alt="phones"
                        className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
                    />
                    <div className="relative z-20 flex flex-col justify-center top-48 left-14 sm:left-5 lg:left-10 px-4 py-6">
                        <h1 style={{
                            fontFamily: '"Style Script", cursive',
                            fontWeight: 900,
                            fontStyle: 'normal'
                        }} className="text-3xl font-semibold font-script text-black uppercase tracking-wide mb-0">
                        # For <span className='text-rose-600 font-bold'>Women !!</span>
                        </h1>
                        <h2 className="text-md  text-black/90 leading-snug mb-3">
                        Sale 10% Off Almost Everything
                        </h2>
                        <Button 
                            onClick={() => navigate("/fashion?category=Women")}
                            className="text-gray-300 bg-black text-sm hover:text-rose-500 transition w-36 rounded-[0px] ml-10">
                        DISCOVER MORE
                        </Button>
                    </div>
                </section>
                <section className='relative bg-white rounded-[5px] shadow-lg m-2 overflow-hidden h-[350px]'>
                    <img
                        src={Accessories}
                        alt="phones"
                        className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
                    />
                    <div className="relative z-20 flex flex-col  justify-center top-48 left-14 lg:left-10 sm:left-3 px-4 py-6">
                        <h1 style={{
                            fontFamily: '"Style Script", cursive',
                            fontWeight: 900,
                            fontStyle: 'normal'
                        }} className="text-3xl font-semibold font-script text-black uppercase tracking-wide">
                        # All <span className='text-orange-500 font-bold'>You Need !!</span>
                        </h1>
                        <h2 className="text-md  text-black/90 leading-snug mb-3">
                        Sale 40% Off Almost Everything
                        </h2>
                        <Button 
                            onClick={() => navigate("/fashion?category=shoes")}
                            className="text-gray-300 bg-black text-sm hover:text-rose-500 transition w-36 rounded-[0px] ml-12">
                        DISCOVER MORE
                        </Button>
                    </div>
                </section>
                <section className='relative bg-white rounded-[5px] shadow-lg m-2 overflow-hidden h-[350px]'>
                    <img
                        src={Men}
                        alt="phones"
                        className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
                    />
                    <div className="relative z-20 flex flex-col justify-center top-48 left-16 sm:left-10 px-4 py-6">
                        <h1 style={{
                            fontFamily: '"Style Script", cursive',
                            fontWeight: 900,
                            fontStyle: 'normal'
                        }} className="text-3xl font-semibold font-script text-black uppercase tracking-wide mb-0">
                        # For <span className='text-blue-600 font-bold'>Men !!</span>
                        </h1>
                        <h2 className="text-md  text-black/90 leading-snug mb-3">
                        Sale 20% Off Almost Everything
                        </h2>
                        <Button 
                            onClick={() => navigate("/fashion?category=Men")}
                            className="text-gray-300 bg-black text-sm hover:text-rose-500 transition w-36 rounded-[0px] ml-10">
                        DISCOVER MORE
                        </Button>
                    </div>
                </section>
            </div>
        </div>
        </>
    )
}

export default FashionSection
