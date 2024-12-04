import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Upload, Trash2, Crop } from "lucide-react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  useAddproductMutation,
  useGetActiveCategoryQuery,
} from "../../services/adminApi";
import { useNavigate } from "react-router-dom";
import { getCroppedImg } from "../../utils/imageCrop";
import { uploadImagesToCloudinary } from "../../services/cloudinary/cloudinary";
import { toast } from "sonner";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [addProduct, { error }] = useAddproductMutation();
  const { data } = useGetActiveCategoryQuery();
  const [form, setForm] = useState({
    productName: "",
    price: "",
    stock: "",
    carat: "",
    description: "",
    category: "",
    origin: "",
    images: [],
  });
  const [categoryList, setCategoryList] = useState([]);
  const [images, setImages] = useState([]);
  const [crop, setCrop] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [imgerr, setImgerr] = useState(false);
  const [isLoading,setIsLoading]=useState(false)

  //for add the active categories to the list
  useEffect(() => {
    if (data && data.categoryList) {
      setCategoryList([...data.categoryList]);
    }
  }, [data]);

  //for handling form
  const handleForm = async (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validateFileType = (file) => {
    if (file && ALLOWED_FILE_TYPES.includes(file.type)) {
      return true
    }
    return false
  }
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif','image/webp']

  //for handling the image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validateFileType(file)){
        setCurrentImage(URL.createObjectURL(file));
        setCrop(
          centerCrop(
            makeAspectCrop(
              { width: 80, aspect: 4 / 3 },
              imgRef.current.width / imgRef.current.height
            )
          )
        );
      }else{
        alert('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.')
      }
   }
  };

  //for handling the cropped image and add to cloudinary then set the url to images
  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      const croppedImageUrl = await getCroppedImg(
        imgRef.current,
        completedCrop
      );
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "cropped.jpeg", { type: "image/jpeg" });
      setIsLoading(true)
      const imgUrl = await uploadImagesToCloudinary(file);
      setIsLoading(false)
      setImages((prevImages) => [...prevImages, imgUrl]);
      setCurrentImage(null);
      setCrop(null);
    }
  };


  //for deleting the selected image
  const handleImageDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  //for handling the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (images.length < 3) {
      return setImgerr(true);
    } else {
      setImgerr(false);
    }
    const completeForm = {
      ...form,
      images: images, 
    };
    const response = await addProduct(completeForm);
    if (response.data) {
      toast.success('product added succesfully')
      navigate("/admin/products");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-800 text-white p-8 mt-5 ml-64"
    >
      <div className="max-w-4xl mx-auto bg-[#111827] rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label={
              error?.data?.messageToProductname
                ? error.data.messageToProductname
                : "Product Name"
            }
            variant="outlined"
            name="productName"
            value={form.productName}
            onChange={handleForm}
            sx={
              error?.data?.messageToProductname
                ? {
                    "& .MuiInputLabel-root": { color: "red" },
                    "& .MuiOutlinedInput-root": {
                      color: "red",
                      "& fieldset": { borderColor: "red" },
                      "&:hover fieldset": { borderColor: "red" },
                      "&.Mui-focused fieldset": { borderColor: "red" },
                    },
                  }
                : {
                    "& .MuiInputLabel-root": { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              fullWidth
              label={
                error?.data?.messageToStock
                  ? error.data.messageToStock
                  : "Stock"
              }
              type="number"
              variant="outlined"
              name="stock"
              value={form.stock}
              onChange={handleForm}
              sx={
                error?.data?.messageToStock
                  ? {
                      "& .MuiInputLabel-root": { color: "red" },
                      "& .MuiOutlinedInput-root": {
                        color: "red",
                        "& fieldset": { borderColor: "red" },
                        "&:hover fieldset": { borderColor: "red" },
                        "&.Mui-focused fieldset": { borderColor: "red" },
                      },
                    }
                  : {
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                    }
              }
            />
            <TextField
              fullWidth
              label={
                error?.data?.messageToCarat
                  ? error.data.messageToCarat
                  : "Carat"
              }
              type="number"
              variant="outlined"
              name="carat"
              value={form.carat}
              onChange={handleForm}
              sx={
                error?.data?.messageToCarat
                  ? {
                      "& .MuiInputLabel-root": { color: "red" },
                      "& .MuiOutlinedInput-root": {
                        color: "red",
                        "& fieldset": { borderColor: "red" },
                        "&:hover fieldset": { borderColor: "red" },
                        "&.Mui-focused fieldset": { borderColor: "red" },
                      },
                    }
                  : {
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                    }
              }
            />
            <TextField
              fullWidth
              label={
                error?.data?.messageToPrice
                  ? error.data.messageToPrice
                  : "Price"
              }
              type="number"
              variant="outlined"
              name="price"
              value={form.price}
              onChange={handleForm}
              sx={
                error?.data?.messageToPrice
                  ? {
                      "& .MuiInputLabel-root": { color: "red" },
                      "& .MuiOutlinedInput-root": {
                        color: "red",
                        "& fieldset": { borderColor: "red" },
                        "&:hover fieldset": { borderColor: "red" },
                        "&.Mui-focused fieldset": { borderColor: "red" },
                      },
                    }
                  : {
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                    }
              }
            />
          </div>
          <TextField
            fullWidth
            label={
              error?.data?.messageToDescription
                ? error.data.messageToDescription
                : "Description"
            }
            multiline
            rows={4}
            variant="outlined"
            name="description"
            value={form.description}
            onChange={handleForm}
            sx={
              error?.data?.messageToDescription
                ? {
                    "& .MuiInputLabel-root": { color: "red" },
                    "& .MuiOutlinedInput-root": {
                      color: "red",
                      "& fieldset": { borderColor: "red" },
                      "&:hover fieldset": { borderColor: "red" },
                      "&.Mui-focused fieldset": { borderColor: "red" },
                    },
                  }
                : {
                    "& .MuiInputLabel-root": { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }
            }
          />
          <div className="flex flex-cols-1 md:flex-cols-2 gap-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label" sx={{ color: "white" }}>
                Category
              </InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={form.category}
                onChange={handleForm}
                label="Category"
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                }}
              >
                {categoryList.map((category, index) => (
                  <MenuItem key={index} value={category.category}>
                    {category.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={
                error?.data?.messageToOrigin
                  ? error.data.messageToOrigin
                  : "Origin"
              }
              variant="outlined"
              name="origin"
              value={form.origin}
              onChange={handleForm}
              sx={
                error?.data?.messageToOrigin
                  ? {
                      "& .MuiInputLabel-root": { color: "red" },
                      "& .MuiOutlinedInput-root": {
                        color: "red",
                        "& fieldset": { borderColor: "red" },
                        "&:hover fieldset": { borderColor: "red" },
                        "&.Mui-focused fieldset": { borderColor: "red" },
                      },
                    }
                  : {
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                    }
              }
            />
          </div>
          
          <Button
            onClick={() => document.getElementById("image-upload").click()}
            startIcon={<Upload />}
          >
            Upload Image
          </Button>
          <input
            type="file"
            id="image-upload"
            onChange={handleImageUpload}
            hidden
          />
          {currentImage && (
            <div className="flex flex-col mt-4 ">
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={setCompletedCrop}
              >
                <img ref={imgRef} src={currentImage} alt="Crop preview" />
              </ReactCrop>
              <Button onClick={handleCropComplete} startIcon={<Crop />}>
              {isLoading?"Adding...":"Add"}
              </Button>
            </div>
          )}
      
          <div className="grid grid-cols-3 gap-4 mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          {imgerr && <p className="text-red-500 text-sm">Images must be 3</p>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className="bg-green-500 hover:bg-green-600 w-full"
          >
            Add Product
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminAddProduct;
