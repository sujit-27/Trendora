import React from 'react'
import Slider from 'react-slick'
import { HeroCategoryData , HeroSliderData , HeroFeatures, HeroCategoryMobileData} from '@/assets/index'
import { Link, useNavigate } from 'react-router-dom'
import Mobile from '@/assets/slider/mobile1.png'
import Perfume from '@/assets/slider/perfume.jpg'

const Hero = () => {

    const navigate = useNavigate()

    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "ease-in-out",
        pauseOnHover: false,
        pauseOnFocus: true,
    };

    const mobileSliderSettings = {
        dots: true,               
        arrows: false,           
        infinite: true,         
        speed: 500,              
        slidesToShow: 1,         
        slidesToScroll: 1,         
        autoplay: true,            
        autoplaySpeed: 3000,       
        cssEase: "ease-in-out",   
        pauseOnHover: false,    
        pauseOnFocus: false,       
        swipeToSlide: true,     
        touchMove: true,      
        draggable: true,        
        responsive: [
            {
            breakpoint: 640,    
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
            }
        ]
    };

    return (
        <>
        <main className='hidden sm:block'>
            <div className='max-w-7xl mx-auto'>
                <div className='grid sm:grid-cols-5 sm:grid-rows-2 gap-3 m-3'>
                    <section className='bg-white hidden sm:block sm:row-span-2 shadow-xl rounded-[5px] h-[400px]'>
                        <div className='m-5'>
                            <div className='text-center bg-rose-500/90 text-white p-2 rounded-[3px]'>
                                <h1 className='font-semibold'>Top Categories</h1>
                            </div>
                            <div>
                                {HeroCategoryData.map((data) => (
                                    <div className='mt-2 mb-2 border-b-2 p-2 text-black hover:text-rose-500'>
                                        <Link id={data.id} to={data.link}>{data.name}</Link>
                                    </div>
                                ))}
                            </div>    
                        </div>
                    </section>

                    <section className='bg-white hidden sm:block sm:row-span-2 sm:col-span-3 shadow-xl rounded-[5px]'>
                        <Slider {...settings}>
                        {HeroSliderData.map((data) => (
                            <div key={data.id}>
                            <div className={`relative grid grid-cols-1 sm:grid-cols-2 items-center px-6 py-0 sm:px-16 shadow-xl overflow-hidden rounded-[5px] h-[400px] ${data.bgColor}`}>

                                {/* BG Title */}
                                <h1 className="absolute text-[90px] font-extrabold opacity-10 uppercase bottom-[-15px] left-10 pointer-events-none z-0">
                                {data.bg_title}
                                </h1>

                                {/* Left Content */}
                                <div className="z-10 space-y-4">
                                <p className="text-sm italic font-semibold text-orange-500">{data.subtitle}</p>
                                
                                <h2 className={`text-4xl sm:text-5xl font-bold leading-tight ${data.textColor}`}>
                                    <span>{data.title.split(' ')[0]}</span>{" "}
                                    <span className={`${data.highlightColor}`}>{data.title.split(' ')[1]}</span>
                                </h2>

                                <p className="text-base text-gray-700  max-w-md leading-relaxed">
                                    {data.description}
                                </p>

                                <button 
                                    onClick={() => {
                                        const path = data.link.startsWith('/') ? data.link : `/${data.link}`;
                                        navigate(path);
                                    }}
                                    className={`text-white px-6 py-2 rounded-full transition duration-300 text-sm font-medium ${data.buttonColor} cursor-pointer`}>
                                    DISCOVER NOW
                                </button>
                                </div>

                                {/* Right Image – Full Height */}
                                <div className="z-10 flex justify-center items-center h-full">
                                <img 
                                    src={data.image}
                                    alt={data.title}
                                    className="h-full object-contain"
                                />
                                </div>

                                </div>
                            </div>
                        ))}
                        </Slider>
                    </section>

                    <section className="relative hidden sm:block w-full bg-white h-[194px] shadow-xl rounded-[5px] overflow-hidden">
                    {/* Background Image */}
                    <img
                        src={Mobile}
                        alt="phones"
                        className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
                    />

                    {/* Text Content */}
                    <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-6">
                        <p className="text-sm font-semibold text-pink-500 uppercase tracking-wide mb-2">
                        Cell Phones
                        </p>
                        <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-3">
                        Trade in and Save, <br /> Limited Edition
                        </h2>
                        <button 
                            onClick={() => navigate("/mobileandaccessories?category=Mobile")}
                            className="text-sm font-semibold text-black underline hover:text-blue-600 transition cursor-pointer">
                        SHOP NOW
                        </button>
                    </div>
                    </section>

                    <section className="relative hidden sm:block w-full bg-white shadow-xl h-[194px] rounded-[5px] overflow-hidden">
                        {/* Background Image */}
                        <img
                            src={Perfume}
                            alt="phones"
                            className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
                        />

                        {/* Text Content */}
                        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-6">
                            <p className="text-sm font-semibold text-pink-600 uppercase tracking-wide mb-2">
                            Fragrance
                            </p>
                            <h2 className="text-xl text-gray-200 font-bold leading-snug mb-3">
                            Quality and Modern,<br /> Ceramic Pots
                            </h2>
                            <button 
                                onClick={() => navigate("/beauty?category=Fragrance")}
                                className="text-sm font-semibold text-gray-200 underline hover:text-blue-600 transition cursor-pointer">
                            SHOP NOW
                            </button>
                        </div>
                    </section>    
                </div>
                <div className='bg-white shadow-xl mt-10 ml-2 mr-2 rounded-[5px] flex items-center justify-evenly'>
                    <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-7 text-center p-7">
                    {HeroFeatures.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.id} className="flex flex-row items-center space-y-2 gap-3 relative">
                            <Icon className="w-12 h-12 text-gray-500" />
                            <div>
                                <h4 className="text-md font-bold text-gray-800">{item.title}</h4>
                                <p className="text-sm font-semibold text-gray-500">{item.subtitle}</p>
                            </div>
                            {item.id !== HeroFeatures.length && (
                                <div className="hidden md:block absolute right-[-12px] top-1/2 transform -translate-y-1/2 h-15 border-r-2 border-gray-300"></div>
                            )}
                            </div>
                        );
                        })}
                    </div>
                </div>
            </div>
        </main>
        <main className='block sm:hidden'>
            <div className='max-w-7xl mx-auto m-1'>
                <section className="bg-white block sm:hidden rounded-[5px] mt-2 shadow-md min-h-[240px]">
                    <Slider {...mobileSliderSettings}>
                        {HeroSliderData.map((data) => (
                        <div key={data.id}>
                            <div
                            className={`relative grid grid-cols-2 gap-3 items-center 
                                shadow-sm overflow-hidden rounded-[5px] 
                                min-h-[240px]
                                ${data.bgColor}`}
                            >
                            {/* BG Title */}
                            <h1 className="absolute text-[48px] font-extrabold opacity-10 uppercase bottom-[4px] left-8 pointer-events-none z-0 leading-none">
                                {data.bg_title}
                            </h1>

                            {/* Left Content */}
                            <div className="z-10 space-y-1.5 col-span-1 pl-3">
                                <p className="text-[15px] italic font-semibold text-orange-500 truncate">
                                {data.subtitle}
                                </p>

                                <h2 className={`text-xl font-bold leading-snug ${data.textColor}`}>
                                <span>{data.title.split(' ')[0]}</span>{" "}
                                <span className={`${data.highlightColor}`}>
                                    {data.title.split(' ')[1]}
                                </span>
                                </h2>

                                <p className="text-[12px] text-gray-700 leading-relaxed line-clamp-3">
                                {data.description}
                                </p>

                                <button
                                onClick={() => {
                                    const path = data.link.startsWith('/') ? data.link : `/${data.link}`;
                                    navigate(path);
                                }}
                                className={`text-white px-4 py-2 rounded-full transition duration-300 text-[15px] font-medium ${data.buttonColor} cursor-pointer`}
                                >
                                DISCOVER NOW
                                </button>
                            </div>

                            {/* Right Image */}
                            <div className="z-10 flex justify-center items-center h-[250px] col-span-1">
                                <img
                                src={data.image}
                                alt={data.title}
                                className="h-full max-h-[250px] w-auto object-contain"
                                draggable={false}
                                />
                            </div>
                            </div>
                        </div>
                        ))}
                    </Slider>
                </section>
                <section className="sm:hidden mt-8 flex flew-row gap-5 overflow-x-auto bg-white shadow-md rounded-[5px] p-3">
                    {HeroCategoryMobileData.map((data) => (
                    <Link
                        key={data.id}
                        to={data.link}
                        className="flex-shrink-0 flex flex-col items-center text-sm"
                    >
                        <div className="w-15 h-15 rounded-full flex items-center justify-center p-1">
                        {/* Placeholder icon or image */}
                        <img src={data.image} alt="" className="object-cover w-12"/>
                        </div>
                        <span className="mt-0 text-gray-600 font-semibold">{data.name}</span>
                    </Link>
                    ))}
                </section> 
                <section className='flex flex-col mt-3 gap-3'>
                    <section className="relative block sm:hidden w-full bg-white shadow-xl rounded-[5px] overflow-hidden">
                        {/* Background Image */}
                        <img
                            src={Perfume}
                            alt="phones"
                            className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
                        />

                        {/* Text Content */}
                        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-6">
                            <p className="text-sm font-semibold text-pink-600 uppercase tracking-wide mb-2">
                            Fragrance
                            </p>
                            <h2 className="text-xl text-gray-200 font-bold leading-snug mb-3">
                            Quality and Modern,<br /> Ceramic Pots
                            </h2>
                            <button 
                                onClick={() => navigate("/beauty?category=Fragrance")}
                                className="text-sm font-semibold text-gray-200 underline hover:text-blue-600 transition cursor-pointer">
                            SHOP NOW
                            </button>
                        </div>
                    </section>
                    
                </section>
            </div>
        </main>
        </>
    )
}

export default Hero
