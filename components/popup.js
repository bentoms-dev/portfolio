import React, { useState, useRef } from 'react'

export default function Popup() {

    const [openPopup, setOpenPopup] = useState(false);

    const modal = useRef()

    function handleOpen() {
        const modalCl = modal.current.classList

        setOpenPopup(true)
        setTimeout(() => {
            modalCl.remove('opacity-0')
            modalCl.remove('-translate-y-full')
            modalCl.remove('scale-150')
        }, 100);
    }

    function handleClose() {
        const modalCl = modal.current.classList

        modalCl.add('-translate-y-full')
        setTimeout(() => {
            modalCl.add('opacity-0')
            modalCl.add('scale-150')
        }, 100);

        setTimeout(() => {
         setOpenPopup(false)
        }, 300);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        console.log(event)
        const formData = new FormData(event.target);

        formData.append("access_key", "d97f514f-c4e5-4822-9163-4b7baf03fa14");

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: json
        });
        const result = await response.json();
        if (result.success) {
            console.log(result);
        }
    }

    return (
    <>
    <button data-modal-target="contact-modal" data-modal-toggle="contact-modal" onClick={handleOpen}  type="button">
        Ready to talk? Let&apos;s go →
    </button>
    <div id="contact-modal" ref={modal} tabIndex="-1" aria-hidden="true" className={`${openPopup ? '' : 'hidden'} overflow-y-auto overflow-x-hidden fixed h-screen flex md:items-center md:justify-center w-full md:inset-0 max-h-full z-50 pacity-0 top-1/4 lg:top-0 left-0 transform -translate-y-full scale-150 transition-opacity transition-transform duration-300`}>
        <div className="relative p-6 w-full max-w-7xl max-h-full">
            <div className="relative contact-form__container shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                    <h3 className="text-xl">
                       Contact me
                    </h3>
                    <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-green-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="contact-modal" onClick={handleClose}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                <div className="p-4 md:p-5">
                    <form className="space-y-4" action="#" onSubmit={handleSubmit}>
                        <div className='flex gap-2 justify-stretch'>
                            <div className="flex-auto">
                                <input type="email" name="email" id="email" className="bg-transparent border border-white text-white text-md focus:ring-green-500 focus:border-green-500 block w-full p-2.5" placeholder="What is your email?" required />
                            </div>
                            <div className="flex-auto">
                                <input type="text" name="name" id="name" placeholder="What is your name?" className="bg-transparent border border-white text-white text-md focus:ring-green-500 focus:border-green-500 block w-full p-2.5" required />
                            </div>
                        </div>
                        <div>
                            <textarea id="message" name="message" className="w-full border text-white border-white p-2.5 bg-transparent focus:ring-3 focus:ring-green-300" placeholder="What do you want me to work on?" required rows={5} cols={100}></textarea>
                        </div>
                        <button type="submit" className="bc__green w-full text-black focus:outline-none font-medium text-lg p-44 text-center">I&apos;m ready to talk</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div className={`${openPopup ? '' : 'hidden'} overlay fixed mix-blend-multiply bg-blue-400 top-0 left-0 h-screen w-screen z-40 backdrop-blur-sm`}></div>
    </>
)
}
