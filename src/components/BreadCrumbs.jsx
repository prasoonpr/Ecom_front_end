/* eslint-disable react/prop-types */
import { Link, useLocation,  } from "react-router-dom"

const BreadCrumbs = ({productName}) => {
    const location=useLocation()
    const pathnames = location.pathname.split('/').filter(x => x)
    return (
        <nav className='  py-2   ps-16 w-full' aria-label='breadcrumb '>
          <ol className='list-reset ms-3 flex items-center'>
           
            {pathnames.map((value, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
              const isLast = index === pathnames.length - 1
              const sample=index===1 
              return isLast ? (
                productName ? (
                  <li key={index} className=" text-gray-700">
                    <span className='mx-2  font-bold'>＞</span>
                    {productName}
                  </li>
                ) : (
                  <li key={index} className=" text-gray-700">
                    <span className='mx-2  font-bold'>＞</span>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </li>
                )
              ) : (
                <li key={index}>
                  <span className='mx-2 text-dark font-bold'>/</span>
                  {sample ?(<Link to={location.pathname} className='text-blue-600 hover:text-blue-700'>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Link>):(<Link to={routeTo} className='text-blue-600 hover:text-blue-700'>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Link>)}
                </li>
              )
            })}
          </ol>
        </nav>
      )
}

export default BreadCrumbs
