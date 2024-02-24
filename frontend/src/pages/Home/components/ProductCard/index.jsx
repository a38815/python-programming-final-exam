// import React from 'react';
import { Link } from 'react-router-dom';
import { numberWithCommas } from '../../../../utils';

const ProductCard = ({ data }) => {
    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:shadow-xl">
            <a href="#">
                <img
                    className="p-8 rounded-t-lg h-[234px]"
                    src={
                        data?.image ||
                        `https://vinhphucwater.com.vn/wp-content/uploads/2023/05/no-image.jpg`
                    }
                    alt="product image"
                />
            </a>
            <div className="px-5 pb-5">
                <a href="#">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                        {data?.name}
                    </h5>
                </a>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-3xl font-bold text-gray-900">
                        ${numberWithCommas(data?.price)}
                    </span>
                    <Link
                        to={`/product-${data?._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 border-[1px] boder-solid border-blue-700 rounded-lg hover:bg-white hover:text-blue-700"
                    >
                        Read more
                        <svg
                            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
