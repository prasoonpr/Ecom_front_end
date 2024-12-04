/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useGetSalesReportQuery } from "../../services/adminApi"
import { motion } from 'framer-motion';
import {  Card, CardContent, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { get } from 'lodash';
import moment from 'moment';
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; 
import { utils, writeFile } from 'xlsx';


const AdminSalesReport = () => {
  const [salesReport,setSalesReport]=useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] =useState(9) 
  const [totalPages,setTotalPages]=useState(1)
  const [sortBy, setSortBy] = useState('yearly');
  const [startDate,setStartDate]=useState('')
  const [endDate,setEndDate]=useState('')
  const {data}=useGetSalesReportQuery({sortBy,startDate,endDate,productsPerPage,currentPage})
  const [totalSales,setTotalSales]=useState(0)
  const [totalDiscount,setTotalDiscount]=useState(0)
  const [totalOrders,setTotalOrders]=useState(0)
  const [revenue,setRevenue]=useState(0)
  const [datePicker,setDatePicker]=useState(false)

  useEffect(()=>{
    if(data?.items){
        setSalesReport([...data.items.currentProducts])
        setTotalPages(data.items.totalPages);
        setTotalOrders(data.items.totalOrders)
        setTotalDiscount(data.items.totalDiscount)
        setRevenue(data.items.revenue)
        setTotalSales(data.items.totalAmount)
    }
  },[data])

 //setting table headers
const headers=[
  {name:"ORDER",key:"productDetails.productName"},
  {name:"EMAIL",key:"userDetails.email"},
  {name:"DATE",key:"items.itemCreatedAt"},
  {name:"DISCOUNT (in %)",key:"items.discount"},
  {name:"OFFER (in %)",key:"items.offer"},
  {name:"ORDER STATUS",key:"items.order_status"},
  {name:"PAYMENT STATUS",key:"items.payment_status"},
  {name:"METHOD",key:"items.payment_method"},
]

//for handling sort 
const handleSort = (event) => {
  if(event.target.value=='customDate'){
    setDatePicker(true)
  }else{
    setDatePicker(false)
  }
  setSortBy(event.target.value);
};

//for download the pdf
const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Sales Report', 14, 20);

  let dateRangeText = '';
  if (sortBy === 'daily') {
    dateRangeText = `Date Range: ${moment().format('DD/MM/YYYY')}`;
  } else if (sortBy === 'weekly') {
    dateRangeText = `Date Range: ${moment().subtract(7, 'days').format('DD/MM/YYYY')} - ${moment().format('DD/MM/YYYY')}`;
  } else if (sortBy === 'yearly') {
    dateRangeText = `Date Range: ${moment().subtract(1, 'year').format('DD/MM/YYYY')} - ${moment().format('DD/MM/YYYY')}`;
  } else if (sortBy === 'customDate') {
    dateRangeText = `Date Range: ${startDate} - ${endDate}`;
  }
  doc.setFontSize(12);
  doc.text(dateRangeText, 14, 30);

  const totalInfo = [
    `Total Sales: Rs.${totalSales}`,
    `Total Discount: Rs.${totalDiscount}`,
    `Total Revenue: Rs.${revenue}`,
    `Total Orders: ${totalOrders}`
  ];
  doc.setFontSize(12);
  let yPos = 40;
  totalInfo.forEach((info) => {
    doc.text(info, 14, yPos); 
    yPos += 10; 
  });

  const tableData = salesReport.map((list) =>
    headers.map((header) => {
      return header.key === 'items.itemCreatedAt'
        ? moment(get(list, header.key)).format('DD/MM/YYYY')
        : header.key === 'items.payment_id'
        ? list.items.payment_id ? 'Razorpay' : 'COD'
        : get(list, header.key, 'N/A');
    })
  );
  doc.autoTable({
    head: [headers.map(header => header.name)], 
    body: tableData, 
    startY: yPos + 10, 
    margin: { top: 40 }, 
    styles: { fontSize: 10 }, 
  });

  doc.save('sales_report.pdf');
};


//for download exel file
const downloadExcel = () => {
  const dateRangeText = getDateRangeText();
  const tableData = formatTableData();
  const formattedTableData = [
    [`${dateRangeText}`], 
    headers.map(header => header.name), 
    ...tableData 
  ];
  const worksheet = utils.aoa_to_sheet(formattedTableData); 
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Sales Report');
  writeFile(workbook, 'sales_report.xlsx');
};

const getDateRangeText = () => {
  if (sortBy === 'daily') {
    return `Date Range: ${moment().format('DD/MM/YYYY')}`;
  } else if (sortBy === 'weekly') {
    return `Date Range: ${moment().subtract(7, 'days').format('DD/MM/YYYY')} - ${moment().format('DD/MM/YYYY')}`;
  } else if (sortBy === 'yearly') {
    return `Date Range: ${moment().subtract(1, 'year').format('DD/MM/YYYY')} - ${moment().format('DD/MM/YYYY')}`;
  } else if (sortBy === 'customDate') {
    return `Date Range: ${startDate} - ${endDate}`;
  }
};
const formatTableData = () => {
  return salesReport.map((list) =>
    headers.map((header) => {
      return header.key === 'items.itemCreatedAt'
        ? moment(get(list, header.key)).format('DD/MM/YYYY')
        : header.key === 'items.payment_id'
        ? list.items.payment_id ? 'Razorpay' : 'COD'
        : get(list, header.key, 'N/A');
    })
  );
};


  return (
    <div className="p-8 bg-gray-800 min-h-screen ml-64">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { title: "Total Sales", value: '₹'+totalSales, change: "+25%" },
        { title: "Total Discount", value: '₹'+totalDiscount, change: "-11%" },
        { title: "Total Revenue", value: '₹'+revenue, change: "+15%" },
        { title: "Total Orders", value: totalOrders, change: "+25%" },
      ].map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-gray-700 text-white">
            <CardContent>
              <Typography variant="h6" component="div">
                {stat.title}
              </Typography>
              <Typography variant="h4" component="div" className="my-2">
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
    <div className="flex">
    <div className="flex items-center">
        <span className="mr-2 text-yellow-500 text-sm">Sort by</span>
        <Select
          value={sortBy}
          onChange={handleSort}
          className="bg-gray-700 text-white text-sm"
          IconComponent={ChevronDown}
          size="small"
        >
          <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="yearly">Yearly</MenuItem>
        <MenuItem value="customDate">Custom Date</MenuItem>
        </Select>
      </div>
      {datePicker&&(
      <div className="ml-2 flex gap-2 items-center">
      <input type="date" onChange={(e)=>{setStartDate(e.target.value)}} className="bg-gray-700"/>
      <input type="date" onChange={(e)=>{setEndDate(e.target.value)}}  className="bg-gray-700"/>
      </div>
      )}
    </div>
    <TableContainer component={Paper} sx={{ backgroundColor: "#111827" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                sx={{ color: "#F59E0B", fontSize: "13px",textAlign: 'center'  }}
              >
                {header.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
     
        <TableBody>
  {salesReport.map((list, index) => (
    <TableRow key={index}>
      {headers.map((header, headerIndex) => (
        <TableCell
          key={headerIndex}
          sx={{ color: "white", fontSize: "11px" ,textAlign: 'center' }}
        >
          <Typography variant="body2" component="div">
            {header.key === 'items.itemCreatedAt'
              ? moment(get(list, header.key)).format('DD/MM/YYYY')
              : get(list, header.key, 'N/A')}
          </Typography>
        </TableCell>
      ))}
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

    <button 
    onClick={downloadPDF}
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 mt-2 rounded"
    >
      Download Pdf
    </button>
    <button 
    onClick={downloadExcel}
      className="bg-yellow-400 ml-2 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 mt-2 rounded"
    >
      Download Exel
    </button>
  </div>
  )
}

export default AdminSalesReport
