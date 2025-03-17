import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Cart() {
  // Mock cart data - in a real app, this would be fetched from state/storage/API
  const cartItems = [
    {
      id: 1,
      title: "Abbey Road",
      artist: "The Beatles",
      price: 29.99,
      image: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
      quantity: 1,
      sellerId: 1,
      sellerName: "VinylVault",
    },
    {
      id: 5,
      title: "Kind of Blue",
      artist: "Miles Davis",
      price: 34.99,
      image: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg",
      quantity: 1,
      sellerId: 2,
      sellerName: "ClassicSpins",
    },
  ];

  // Calculate cart total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Product</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Price</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Quantity</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Total</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="transition-colors duration-300">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded">
                            <Image
                              src={item.image}
                              alt={`${item.title} by ${item.artist}`}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <Link 
                              href={`/shop/${item.id}`}
                              className="font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-300"
                            >
                              {item.title}
                            </Link>
                            <div className="text-gray-500 dark:text-gray-400 transition-colors duration-300">{item.artist}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Seller: {item.sellerName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900 dark:text-white transition-colors duration-300">${item.price.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <button className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-l-md border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            -
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            className="h-8 w-12 border-t border-b border-gray-300 dark:border-gray-600 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                            readOnly
                          />
                          <button className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-r-md border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Link
                href="/shop"
                className="flex items-center text-primary hover:text-primary/80 transition-colors duration-300"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
              <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded transition-colors duration-300">
                Update Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Order Summary</h2>
              <div className="border-t dark:border-gray-700 pt-4 transition-colors duration-300">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Shipping</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t dark:border-gray-700 mt-4 transition-colors duration-300">
                  <span className="text-gray-900 dark:text-white font-bold transition-colors duration-300">Total</span>
                  <span className="text-primary text-xl font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="mt-6 w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-md font-medium transition-colors duration-300">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors duration-300">
          <h2 className="text-xl font-medium mb-4 text-gray-900 dark:text-white transition-colors duration-300">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">Looks like you haven't added any records to your cart yet.</p>
          <Link 
            href="/shop" 
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium inline-block transition-colors duration-300"
          >
            Browse Records
          </Link>
        </div>
      )}
    </div>
  );
} 