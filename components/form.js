export default function Form() {

    // Handles the submit event on form submit.
    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()

        // Get data from the form.
        const data = {
            name: event.target.name.value,
            company: event.target.company.value,
            email: event.target.email.value,
            message: event.target.message.value
        }

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/form'

        // Form the request for sending data to the server.
        const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
            'Content-Type': 'application/json',
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
        }

        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options)

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json()
        console.log(`Is this your full name: ${result.data}`)
    }

    return (
        <div className='grid grid-cols-1 w-1/4 h-1/3 form'>
            <form className="w-full max-w-lg">
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block bg-black text-white py-6  font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                            Name
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="appearance-none w-full py-7 px-4 text-white leading-tight focus:outline-none focus:text-black focus:bg-white focus:border-white" id="inline-full-name" type="text" placeholder="Johnny Bravo"/>
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block bg-black text-white py-6 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-email">
                            Email
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="appearance-none w-full py-7 px-4 text-white leading-tight focus:outline-none focus:text-black focus:bg-white focus:border-white" id="inline-email" type="email" placeholder="johnnyb@google.com"/>
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block bg-black text-white py-6 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-company">
                            Company
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="appearance-none w-full py-7 px-4 text-white leading-tight focus:outline-none focus:text-black focus:bg-white focus:border-white" id="inline-company" type="company" placeholder="Google Inc"/>
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block bg-black text-white py-9 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-message">
                            How can I help?
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <textarea
                        id='inline-message'
                        name='message'
                        className="appearance-none w-full py-7 px-4 text-white leading-tight focus:outline-none focus:text-black focus:bg-white focus:border-white"
                        ></textarea>
                    </div>
                </div>

                <div className="md:flex md:items-center">
                    <div className="md:w-1/3"></div>
                    <div className="md:w-2/3">
                    <button className="shadow bg-black hover:bg-white hover:text-black focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                        Send it
                    </button>
                    </div>
                </div>
            </form>

            {/* <form
            name="contact"
            method="POST"
            data-netlify="true"
            className="px-8 pt-6 pb-8 mb-4">
                <div className="grid">
                    <div className="mb-4">
                        <label
                        htmlFor="name"
                        className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                        <input
                        type="text"
                        id="name"
                        name="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label
                        htmlFor="company"
                        className="block text-gray-700 text-sm font-bold mb-2">Company</label>
                        <input
                        type="text"
                        id="company"
                        name="company"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label
                        htmlFor="email"
                        className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                        type="text"
                        id="email"
                        name="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="message">How can I help?</label>
                        <textarea
                        id='message'
                        name='message'
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                            Send it
                        </button>
                    </div>
                </div>
            </form> */}
        </div>
    )
}
