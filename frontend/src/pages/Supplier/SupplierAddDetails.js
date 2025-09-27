import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateSupplierDetails, fetchplaceanddistrict } from '../../redux/slices/supplierSlice'
function SupplierAddDetails() {
    const [district, setDistrict] = useState('')
    const [place, setPlace] = useState('')
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { supplierInfo } = useSelector((state) => state.supplier)


    useEffect(() => {
        if (!supplierInfo) return;

        (async () => {
            const res = await dispatch(fetchplaceanddistrict({ email: supplierInfo.email })).unwrap();
            setPlace(res.place);
            setDistrict(res.district);

        })();
    }, [supplierInfo, dispatch]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // start loading

        try {
            await dispatch(
                updateSupplierDetails({
                    email: supplierInfo.email,
                    district,
                    place
                })
            ).unwrap();

            alert("Details sent for admin approval!");
            navigate("/supplier/dashboard"); // navigate after success
        } catch (err) {
            alert(err || "Failed to update details");
        } finally {
            setLoading(false); // stop loading
        }
    };




    return (
        <div className="p-6 max-w-sm mx-auto bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Add Supplier Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold">District</label>
                    <input
                        type="text"
                        placeholder="Enter District"
                        className="border p-2 w-full rounded"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Place</label>
                    <input
                        type="text"
                        placeholder="Enter Place"
                        className="border p-2 w-full rounded"
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>

            </form>
            <button
                onClick={() => navigate(-1)}
                className="flex mt-3 items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform duration-150"
            >
                ← Back
            </button>

        </div>
    )
}

export default SupplierAddDetails
