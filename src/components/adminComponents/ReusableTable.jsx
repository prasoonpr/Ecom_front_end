/* eslint-disable react/prop-types */
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Lock, Unlock,Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

const ReusableTable = ({ list, headers, handleBlock,handleEdit,setCurrentPage,currentPage,totalPages }) => {

  const location=useLocation()
  const notEdit=location.pathname!=='/admin/users'&&location.pathname!=='/admin/coupons'&&location.pathname!=='/admin/offers'
  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "#111827" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                sx={{ color: "#F59E0B", fontSize: "13px" ,textAlign: 'center' }}
              >
                {header.name}
              </TableCell>
            ))}
            <TableCell sx={{ color: "#F59E0B", fontSize: "13px" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((list, index) => (
            <TableRow key={index}>
              {headers.map((header, headerIndex) => (
                <TableCell
                  key={headerIndex}
                  sx={{ color: "white", fontSize: "11px" ,textAlign: 'center' }}
                >
                  {list[header.key]}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex space-x-2">
                  {notEdit&&
                  <Tooltip title="Edit">
                    <Pencil onClick={()=>handleEdit(list._id,index)} className="text-gray-500 cursor-pointer"size={19}/>
                  </Tooltip>
                  }
                  <Tooltip title={list.status ? "Block" : "Unblock"}>
                    <IconButton
                      size="small"
                      onClick={() => handleBlock(list._id)}
                      sx={
                        list.status
                          ? { color: "green", "&:hover": { color: "red" } }
                          : { color: "red", "&:hover": { color: "green" } }
                      }
                    >
                      {list.status ? <Unlock size={16} /> : <Lock size={16} />}
                    </IconButton>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
      <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded bg-[#374151] px-3 py-1 text-white disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
              
                <span className="text-yellow-400">{`Page ${currentPage} of ${totalPages || 1}`}</span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded bg-[#374151] px-3 py-1 text-white disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
    </TableContainer>
  );
};

export default ReusableTable;
