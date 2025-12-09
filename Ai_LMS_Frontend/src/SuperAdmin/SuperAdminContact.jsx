// import axios from "axios";
// import { useEffect, useState } from "react";

// function SuperAdminContact() {
//     const [querry, setQuerry] = useState([])




//     useEffect(() => {
//         axios.get("https://lmsdemo.thirdvizion.com/api/contactlistview/").then((res) => {
//             setQuerry(res.data)
//         }).catch(() => {
//             console.error("Error in receving Data")
//         })

//     }, [])
//     return (
//         <div className="flex justify-center  min-h-screen bg-gray-100">
//             <div className="w-full max-w-6xl p-6 rounded-2xl">
//                 <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
//                     Contact Queries
//                 </h2>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow">
//                         <thead className="bg-gray-200">
//                             <tr>
//                                 <th className="px-4 py-3 text-center border-b border-gray-300  text-sm font-semibold text-gray-700">
//                                     S.NO
//                                 </th>
//                                 <th className="px-4 py-3 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">
//                                     Name
//                                 </th>
//                                 <th className="px-4 py-3 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">
//                                     Email
//                                 </th>
//                                 <th className="px-4 py-3 border-b border-gray-300 text-centertext-sm font-semibold text-gray-700">
//                                     Phone Number
//                                 </th>
//                                 <th className="px-4 py-3 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">
//                                     Messages
//                                 </th>
//                                 <th className="px-4 py-3 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">
//                                     Date
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {
//                                 querry.map((item,index) => {
//                                     return (<>
//                                         <tr key={index} className={`${index%2==0 ? "bg-white":"bg-[#EFF6FF]"}`}>
//                                             <td className="px-2 py-3 border-b text-center border-gray-200 text-sm text-gray-700">
//                                                 {item.id}
//                                             </td>
//                                             <td className="px-2 py-3 border-b text-center border-gray-200 text-sm text-gray-700">
//                                                 {item.name}
//                                             </td>
//                                             <td className="px-2 py-3 border-b text-center border-gray-200 text-sm text-gray-700">
//                                                 {item.email}
//                                             </td>
//                                             <td className="px-2 py-3 border-b text-center border-gray-200 text-sm text-gray-700">
//                                                 {item.phone}
//                                             </td>
//                                             <td className="px-2 py-3 border-b w-36 text-center border-gray-200 text-sm text-gray-700">
//                                                 {item.message}
//                                             </td>
//                                             <td className="px-2 py-3 border-b text-center border-gray-200 text-sm text-gray-700">
//                                                 {item.date.slice(0,10)}
//                                             </td>
//                                         </tr>     </>)
//                                 })

//                             }
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SuperAdminContact;






import axios from "axios";
import { useEffect, useState } from "react";

function SuperAdminContact() {
    const [queries, setQueries] = useState([]);

    useEffect(() => {
        axios
            .get("https://lmsdemo.thirdvizion.com/api/contactlistview/")
            .then((res) => setQueries(res.data))
            .catch(() => console.error("Error fetching contact queries"));
    }, []);

    return (
        <div className="p-6 bg-orange-50 rounded-xl shadow-inner max-w-screen-xl mx-auto min-h-[calc(100%-30px)]">
            {/* Header */}
            <h2 className="text-3xl font-bold text-orange-800 mb-6 text-center">
                Contact Queries
            </h2>

            {/* Empty check */}
            {queries.length === 0 && (
                <p className="text-center text-orange-700">No contact queries available.</p>
            )}

            <div className="space-y-4">
                {queries.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center bg-white border border-orange-200 rounded-xl shadow-sm hover:shadow-md transition-all p-5 gap-4"
                    >
                        {/* Left — S.No */}
                        <div className="w-16 h-16 flex items-center justify-center bg-orange-100 border border-orange-200 rounded-lg font-bold text-orange-700 text-xl">
                            {item.id}
                        </div>

                        {/* Middle — Message Details */}
                        <div className="flex-1 space-y-1">
                            <h3 className="text-lg font-semibold text-orange-800">
                                {item.name}
                            </h3>

                            <p className="text-sm text-orange-700">
                                <span className="font-semibold">Email: </span>
                                {item.email}
                            </p>

                            <p className="text-sm text-orange-700">
                                <span className="font-semibold">Phone: </span>
                                {item.phone}
                            </p>

                            <p className="text-sm text-orange-700 mt-2">
                                <span className="font-semibold">Message:</span>
                                <br />
                                <span className="inline-block bg-orange-50 border border-orange-200 rounded-md p-2 text-gray-800 mt-1">
                                    {item.message}
                                </span>
                            </p>
                        </div>

                        {/* Right — Date */}
                        <div className="text-center sm:text-right">
                            <p className="text-sm text-orange-700 font-semibold">Received</p>
                            <p className="text-orange-900 font-bold text-md">
                                {item.date?.slice(0, 10)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SuperAdminContact;
