import React from "react";
import Layout from "../../components/Layout";
import "./style.css";
import ProductStore from "./ProductStore";
import { useParams, useLocation } from "react-router-dom";
import { getParams } from "../../utils/getParams";
import ProductPage from "./ProductPage";
import ClothingAndAccessories from "./ClothingAndAccessories";
/**
 * @author
 * @function ProductListPage
 **/

const ProductListPage = (props) => {
  const params = useParams();
  const location = useLocation();

  const renderProduct = () => {
    const newParams = getParams(location.search);
    let content = null;
    switch (newParams.type) {
      case "store":
        content = (
          <ProductStore params={params} location={location} {...props} />
        );
        break;
      case "page":
        content = (
          <ProductPage params={params} location={location} {...props} />
        );
        break;
      default:
        content = <ClothingAndAccessories {...props} />;
    }

    return content;
  };

  return <Layout>{renderProduct()}</Layout>;
};

export default ProductListPage;
