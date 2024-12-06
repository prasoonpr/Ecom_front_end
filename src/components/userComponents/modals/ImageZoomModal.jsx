/* eslint-disable react/prop-types */
import  { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut } from "lucide-react";

function ImageZoomModal({
  isOpen,
  onRequestClose,
  selectedImage,
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Image Modal"
      className="fixed inset-0 flex items-center  justify-center backdrop-blur-sm bg-black bg-opacity-50"
      overlayClassName="fixed z-50 inset-0"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <button
          className="absolute top-4 right-4 text-white z-20 bg-black p-2 rounded-full hover:bg-gray-800"
          onClick={onRequestClose}
        >
          <IoClose size={30} />
        </button>

    

        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={5}
            doubleClick={{ mode: "toggle" }}
            onWheel={(e) => {
                e.preventDefault(); 
                const zoomSpeed = 0.5; 
                if (e.deltaY > 0) {
                  e.target.zoomOut(zoomSpeed);
                } else {
                  e.target.zoomIn(zoomSpeed);
                }
              }}
          >
            {({ zoomIn, resetTransform }) => (
              <>
                <TransformComponent
                  wrapperClass="w-full  h-full"
                  contentClass="w-full h-full cursor-pointer flex items-center justify-center"
                >
                  <img
                    src={selectedImage || "/api/placeholder/400/320"}
                    alt={`Product`}
                    className="max-w-none max-h-none  object-contain"
                    style={{maxHeight:"1000px ",maxWidth:"1000px" }}
                  />
                </TransformComponent>
                <button
                  className="absolute bottom-4 right-4 text-white z-20 bg-black p-2 rounded-full hover:bg-gray-800"
                  onClick={() => {
                    if (isZoomed) {
                      resetTransform();
                      setIsZoomed(false);
                    } else {
                      zoomIn(7.0);
                      setIsZoomed(true);
                    }
                  }}
                >
                  {isZoomed ? <ZoomOut size={28} /> : <ZoomIn size={28} />}
                </button>
              </>
            )}
          </TransformWrapper>
        </motion.div>
      </div>
    </Modal>
  );
}

export default ImageZoomModal;