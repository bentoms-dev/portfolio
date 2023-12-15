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
    <div id="contact-modal" ref={modal} tabIndex="-1" aria-hidden="true" className={`${openPopup ? '' : 'hidden'} overflow-y-auto overflow-x-hidden fixed h-screen flex lg:items-center lg:justify-center w-full md:inset-0 max-h-full z-10 pacity-0 sm:top-0 sm:left-0 transform -translate-y-full scale-150 transition-opacity transition-transform duration-300`}>
        <div className="relative p-6 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow ">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                    <h3 className="text-xl text-black">
                       Tell me about your project
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
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Your email</label>
                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5" placeholder="name@company.com" required />
                        </div>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">Your name</label>
                            <input type="text" name="name" id="name" placeholder="Your Name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5" required />
                        </div>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">How can I help?</label>
                            <textarea id="message" name="message" className="w-full border text-gray-900 border-gray-300 rounded p-2.5 bg-gray-50 focus:ring-3 focus:ring-green-300" placeholder="Write a brief message" required rows={5} cols={100}></textarea>
                        </div>
                        <button type="submit" className="w-full text-black bg-green-300 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Send it!</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </>
)
}
