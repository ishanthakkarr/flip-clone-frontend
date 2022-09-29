import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductDetailsById } from '../../actions';
import {
    IoIosArrowForward,
    IoIosStar,
    IoMdCart
} from 'react-icons/io';
import { BiRupee } from 'react-icons/bi';
import { AiFillThunderbolt } from 'react-icons/ai';
import { MaterialButton } from '../../components/MaterialUI';
import './style.css';
import { generatePublicUrl } from '../../urlConfig';
import { addToCart } from '../../actions';
/**
* @author
* @function ProductDetailsPage
**/

const ProductDetailsPage = (props) => {

    const [selectedProductPictureUrl, setSelectedProductPictureUrl] = useState(null);
    const dispatch = useDispatch();
    const params = useParams();
    const product = useSelector(state => state.product);
    const navigate = useNavigate();

    useEffect(() => {
        if (product?.productDetails?.productPictures?.length > 0)
            setSelectedProductPictureUrl(product.productDetails.productPictures[0].img);
    }, [product.productDetails.productPictures]);

    useEffect(() => {
        const payload = {
            params: {
                productId: params.productId
            }
        }
        dispatch(getProductDetailsById(payload));
    }, []);

    const setSelectedImage = (selectedImgUrl) => {
        setSelectedProductPictureUrl(selectedImgUrl);
    }

    if (Object.keys(product.productDetails).length === 0) {
        return null;
    }

    return (
        <Layout>
            {/* <div>{product.productDetails.name}</div> */}
            <div className="productDescriptionContainer">
                <div className="flexRow">
                    <div className="verticalImageStack">
                        {
                            product.productDetails.productPictures.map((thumb, index) =>
                                <div className="thumbnail">
                                    <img src={generatePublicUrl(thumb.img)} alt={thumb.img} onClick={() => setSelectedImage(thumb.img)} />
                                </div>
                            )
                        }

                    </div>
                    <div className="productDescContainer">
                        <div className="productDescImgContainer">
                            <img src={generatePublicUrl(selectedProductPictureUrl)} alt={`${selectedProductPictureUrl}`} />
                        </div>

                        {/* action buttons */}
                        <div className="flexRow">
                            <MaterialButton
                                title="ADD TO CART"
                                bgColor="#ff9f00"
                                textColor="#ffffff"
                                style={{
                                    marginRight: '5px'
                                }}
                                icon={<IoMdCart />}
                                onClick={() => {
                                    const { _id, name, price } = product?.productDetails;
                                    const img = product.productDetails.productPictures[0].img;
                                    dispatch(addToCart({
                                        _id,
                                        name,
                                        price,
                                        img
                                    }));
                                    // props.history.push('/cart');
                                    navigate("/cart", { replace: true });
                                }}
                            />
                            <MaterialButton
                                title="BUY NOW"
                                bgColor="#fb641b"
                                textColor="#ffffff"
                                style={{
                                    marginLeft: '5px'
                                }}
                                icon={<AiFillThunderbolt />}
                            />
                        </div>
                    </div>
                </div>
                <div>

                    {/* home > category > subCategory > productName */}
                    <div className="breed">
                        <ul>
                            <li><a href="#">Home</a><IoIosArrowForward /></li>
                            <li><a href="#">Mobiles</a><IoIosArrowForward /></li>
                            <li><a href="#">Samsung</a><IoIosArrowForward /></li>
                            <li><a href="#">{product.productDetails.name}</a></li>
                        </ul>
                    </div>
                    {/* product description */}
                    <div className="productDetails">
                        <p className="productTitle">{product.productDetails.name}</p>
                        <div>
                            <span className="ratingCount">4.3 <IoIosStar /></span>
                            <span className="ratingNumbersReviews">72,234 Ratings & 8,140 Reviews</span>
                        </div>
                        <div className="extraOffer">Extra <BiRupee />4500 off </div>
                        <div className="flexRow priceContainer">
                            <span className="price"><BiRupee />{product.productDetails.price}</span>
                            <span className="discount" style={{ margin: '0 10px' }}>22% off</span>
                            {/* <span>i</span> */}
                        </div>
                        <div>
                            <p style={{
                                color: '#212121',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>Available Offers</p>
                            <p style={{ display: 'flex' }}>
                                <span style={{
                                    width: '100px',
                                    fontSize: '12px',
                                    color: '#878787',
                                    fontWeight: '600',
                                    marginRight: '20px'
                                }}>Description</span>
                                <span style={{
                                    fontSize: '12px',
                                    color: '#212121',
                                }}>{product?.productDetails?.description}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetailsPage