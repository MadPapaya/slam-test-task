import CatalogItem from "../components/CatalogItem";
import {useEffect, useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/20/solid";

function Catalog() {
  const [pageNumber, setPageNumber] = useState(1)
  const [products, setProducts] = useState(null)
  const productPrices = {minPrice: 0, maxPrice: 1000}
  const [priceFilterValues, setPriceFilterValues] = useState({minPrice: 0, maxPrice: 1000})

  const updateProducts = async (page = 1) => {
    const response = await fetch(`https://api.escuelajs.co/api/v1/products?offset=${page - 1}&limit=8&price_min=${priceFilterValues.minPrice}&price_max=${priceFilterValues.maxPrice}`)
    if (response.ok) {
      const data = await response.json();
      setProducts(data)
      setPageNumber(page)
    }
  }

  useEffect(() => {
    updateProducts()
  }, [])


  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        {/*price range filter*/}
        <div className="range-filter-wrapper">
          <label htmlFor="steps-range-min" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Min Price: {priceFilterValues.minPrice}
          </label>
          <label htmlFor="steps-range-max" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Max Price: {priceFilterValues.maxPrice}
          </label>

          <input id="steps-range-min" type="range"
                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                 min={productPrices.minPrice}
                 max={productPrices.maxPrice}
                 value={priceFilterValues.minPrice}
                 step="10"
                 onChange={(e) => {
                   setPriceFilterValues(prevState => {
                     return {minPrice: Number(e.target.value) <= prevState.maxPrice - 10 ? Number(e.target.value) : prevState.maxPrice - 10, maxPrice: prevState.maxPrice}
                   })
                 }}
                 onMouseUp={() => {
                   setPageNumber(1)
                   updateProducts()
                 }}
                 onKeyUp={() => {
                   setPageNumber(1)
                   updateProducts()
                 }}
          />
          <input id="steps-range-max" type="range"
                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                 min={productPrices.minPrice}
                 max={productPrices.maxPrice}
                 value={priceFilterValues.maxPrice}
                 step="10"
                 onChange={(e) => {
                   setPageNumber(1)
                   setPriceFilterValues(prevState => {
                     return {minPrice: prevState.minPrice, maxPrice: Number(e.target.value) >= prevState.minPrice + 10 ? Number(e.target.value) : prevState.minPrice + 10 }
                   })
                 }}
          />
        </div>


        {/*products*/}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products && products.map(product => (
            <CatalogItem product={product} key={product.id}/>
          ))}
        </div>

        {/*pagination*/}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6  mt-10">
          <div className="flex flex-1 justify-between sm:hidden">
            <a
              onClick={() => updateProducts(pageNumber > 1 ? pageNumber - 1 : 1)}
              className="cursor-pointer relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              onClick={() => updateProducts(pageNumber < 5 ? pageNumber + 1 : 5)}
              className="cursor-pointer relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </a>
          </div>

          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{pageNumber * 8 - 7}</span> to <span
                className="font-medium">{pageNumber * 8}</span> of{' '}
                <span className="font-medium">40</span> results
              </p>
            </div>

            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <a
                  onClick={() => updateProducts(pageNumber > 1 ? pageNumber - 1 : 1)}
                  className="cursor-pointer relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
                </a>

                {Array.from(Array(5)).map((page, index) => (
                  <a
                    key={index}
                    onClick={() => updateProducts(index + 1)}
                    className={`${pageNumber === index + 1 ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'} focus:z-20 cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold`}
                  >
                    {index + 1}
                  </a>
                ))}

                <a
                  onClick={() => updateProducts(pageNumber < 5 ? pageNumber + 1 : 5)}
                  className="cursor-pointer relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Catalog