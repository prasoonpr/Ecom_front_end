import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ModalAddCategory from './modals/ModalAddCategory';
import { useCategoryBlockMutation, useGetCategoryQuery } from '../../services/adminApi';
import LoadingModal from '../LoadingModal';
import ReusableTable from './ReusableTable';
import ModalEditCategory from './modals/ModalEditCategory';

const AdminCategory = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] =useState(9) 
  const [totalPages,setTotalPages]=useState(1)
    const {data,isError,isLoading}=useGetCategoryQuery({page:currentPage,limit:productsPerPage})
    const [categoryBlock]=useCategoryBlockMutation()
    const [categoryList,setCategoryList]=useState([])
    const [add,SetAdd]=useState(false)
    const [edit,setEdit]=useState(false)
    const [item,setItem]=useState({})

    // setting lists to state while mount
    useEffect(()=>{
      if(data&&data.categoryList){
        setCategoryList([...data.categoryList])
        setTotalPages(data.totalPages)
      }
    },[data])
    
    //for handle block
    const handleBlock=async(id)=>{
      try {
        await categoryBlock({id})
      } catch (error) {
        console.log(error);   
      }
  }

  //for handle add category
    const handleAdd=()=>{
      SetAdd(!add)
    }

    const handleEdit=(id,index)=>{
      const editCategory=[...categoryList]
      setItem(editCategory[index])
      setEdit(!edit)
    }

    const headers=[
      {name:"CATEGORY",key:"category"},
      {name:"DESCRIPTION",key:"description"},
    ]


    if(isLoading){
      return <LoadingModal/>
    }
    
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="pt-14 bg-gray-800 min-h-screen ml-64 text-white"
  >
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">CATEGORY</h1>
      <div className="flex items-center">
          <button onClick={handleAdd} className='bg-gray-900 p-2 rounded-lg'>add category</button>
      </div>
    </div>
    {isError? <div>Error While User Loading</div>:
    <ReusableTable list={categoryList} handleBlock={handleBlock} headers={headers} handleEdit={handleEdit} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>
    }
    {add&&(
      <ModalAddCategory handleAdd={handleAdd} setCategoryList={setCategoryList}/>
      )}
      {edit&&<ModalEditCategory handleEdit={handleEdit} item={item} />}
  </motion.div>
  )
}

export default AdminCategory
