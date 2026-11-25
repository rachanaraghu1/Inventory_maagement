import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

export default function InsertProduct() {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productBarcode, setProductBarcode] = useState("");
    const [quantity, setQuantity] = useState("");
    const [reserved, setReserved] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate("");

    const setName = (e) => {
        setProductName(e.target.value);
    }

    const setPrice = (e) => {
        setProductPrice(e.target.value);
    }

    const setBarcode = (e) => {
        const value = e.target.value.slice(0, 12);
        setProductBarcode(value);
    };

    const addProduct = async (e) => {
        e.preventDefault();

        if (!productName || !productPrice || !productBarcode || !quantity || !reserved) {
            setError("*Please fill in all the required fields.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('token');
            const res = await fetch("https://inventory-maagement.onrender.com/insertproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ "ProductName": productName, "ProductPrice": productPrice, "ProductBarcode": productBarcode, "quantity": quantity, "reserved": reserved })
            });

            await res.json();

            if (res.status === 201) {
                alert("Data Inserted");
                setProductName("");
                setProductPrice("");
                setProductBarcode("");
                setQuantity("");
                setReserved("");
                navigate('/products');
            }
            else if (res.status === 422) {
                alert("Product is already added with that barcode.");
            }
            else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='container-fluid p-5'>
             <h1 className=''>Enter Product Information</h1>
             
            <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_name" className="form-label fw-bold">Product Name</label>
                <input type="text" onChange={setName} value={productName} className="form-control fs-5" id="product_name" placeholder="Enter Product Name" required />
            </div>
            <div className="mt-3 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_price" className="form-label fw-bold">Product Price</label>
                <input type="number" onChange={setPrice} value={productPrice} className="form-control fs-5" id="product_price" placeholder="Enter Product Price" required />
            </div>
            <div className="mt-3 mb-5 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_barcode" className="form-label fw-bold">Product Barcode</label>
                <input type="number" onChange={setBarcode} value={productBarcode} maxLength={12} className="form-control fs-5" id="product_barcode" placeholder="Enter Product Barcode" required />
            </div>
            <div className="mt-3 mb-5 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_quantity" className="form-label fw-bold">Quantity</label>
                <input type="number" onChange={e => setQuantity(e.target.value)} value={quantity} min={0} className="form-control fs-5" id="product_quantity" placeholder="Enter Quantity" required />
            </div>
            <div className="mt-3 mb-5 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_reserved" className="form-label fw-bold">Reserved</label>
                <input type="number" onChange={e => setReserved(e.target.value)} value={reserved} min={0} className="form-control fs-5" id="product_reserved" placeholder="Enter Reserved Quantity" required />
            </div>
            <div className='d-flex justify-content-center col-lg-6 col-md-6'>
                <NavLink to="/products" className='btn btn-primary me-5 fs-4'>Cancel</NavLink>
                <button type="submit" onClick={addProduct} className="btn btn-primary fs-4" disabled={loading}>{loading ? 'Inserting...' : 'Insert'}</button>
            </div>
            <div className="col text-center col-lg-6">
                {error && <div className="text-danger mt-3 fs-5 fw-bold">{error}</div>}
            </div>
        </div>
    )
}
