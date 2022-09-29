import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getParams } from '../../../utils/getParams';
import { getProductsPage } from '../../../actions/'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Card from '../../../components/UI/Card'
/**
* @author
* @function ProductPage
**/

const ProductPage = (props) => {
    const dispatch = useDispatch();
    const product = useSelector(state => state.product);
    useEffect(() => {
        const params = getParams(props.location.search);
        const payload = {
            params
        }
        dispatch(getProductsPage(payload));
    }, [])
    return (
        <div style={{ margin: '0 10px' }}>
            <h3>{product.page ? product.page.title : ""}</h3>
            <Carousel
                renderThumbs={() => { }}
            >
                {product && product.page && product.page.banners && product.page.banners.map((banner, index) => (
                    <div>
                        <a
                            key={index}
                            style={{ display: 'block' }}
                            href={banner.navigateTo}
                        >
                            <img src={banner.img} alt="" height="500px" />
                        </a>
                    </div>
                ))}
            </Carousel>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', margin: '10px 0' }}>
                {
                    product && product.page && product.page.products && product.page.products.map((_product, index) =>
                        <Card
                            key={index}
                            style={{
                                width: '400px',
                                height: '200px',
                                margin: '0 5px'
                            }}
                        >
                            <img style={{ width: '100%', height: '100%' }} src={_product.img} alt="" />
                         </Card>
                    )
                }
            </div>
        </div>
    )

}

export default ProductPage