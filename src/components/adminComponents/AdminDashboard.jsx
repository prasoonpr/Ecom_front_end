import { Card, CardContent, Typography, Select, MenuItem, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { useGetGraphDateQuery, useGetTopFiveCategoryQuery, useGetTopTenProductsQuery } from '../../services/adminApi';
import { useState } from 'react';
// const salesData = [
//     { name: '01 Jan', value: 20000 },
//     { name: '02 Jan', value: 25000 },
//     { name: '03 Jan', value: 18000 },
//     { name: '04 Jan', value: 30000 },
//     { name: '05 Jan', value: 40000 },
//     { name: '06 Jan', value: 35000 },
//     { name: '07 Jan', value: 28000 },
//   ];


const AdminDashboard = () => {
  const {data:topProducts}=useGetTopTenProductsQuery()
  const {data:topCategory}=useGetTopFiveCategoryQuery()
  const [period,setPeriod]=useState('daily')
  const {data:graphData}=useGetGraphDateQuery({period})
  const productHeaders = [
    { name: 'PRODUCT NAME', key: 'productName' },
    { name: 'CATEGORY', key: 'category' },
    { name: 'TOTAL ORDER', key: 'orderCount' },
    { name: 'TOTAL QUANTITY SELLED', key: 'totalQuantitySelled' },
    { name: 'TOTAL REVENUE', key: 'totalRevenue' },
  ]; 
  const categoryHeaders = [
    { name: 'CATEGORY NAME', key: 'category' },
    { name: 'TOTAL ORDER', key: 'totalOrder' },
    { name: 'TOTAL QUANTITY SELLED', key: 'totalQuantitySelled' },
    { name: 'TOTAL REVENUE', key: 'totalRevenue' },
  ]; 
  return (
    <div className="p-8 bg-gray-800 min-h-screen ml-64">
        <div className="flex items-center mt-12">
        <span className="mr-2 text-yellow-500 text-sm">Sort by</span>
        <Select
          value={period}
          onChange={(e)=>{setPeriod(e.target.value)}}
          className="bg-gray-700 text-white text-sm"
          IconComponent={ChevronDown}
          size="small"
        >
          <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="monthly">monthly</MenuItem>
        <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </div>

      {/* Sales Overview Chart */}
      <Card className="bg-gray-700 text-white mb-8 ">
        <CardContent>
          <Typography variant="h6" component="div" className="mb-4">
            Sales Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* best selling products  */}
      <h1 className='text-white font-bold text-2xl mb-1'>Top 10 Products</h1>
      <TableContainer component={Paper} sx={{ backgroundColor: "#111827" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {productHeaders?.map((header, index) => (
              <TableCell
                key={index}
                sx={{ color: "#F59E0B", fontSize: "13px" ,textAlign: 'center' }}
              >
                {header.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {topProducts?.map((list, index) => (
            <TableRow key={index}>
              {productHeaders?.map((header, headerIndex) => (
                <TableCell
                  key={headerIndex}
                  sx={{ color: "white", fontSize: "11px" ,textAlign: 'center' }}
                >
                  {list[header.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* best selling category */}
    <h1 className='text-white font-bold text-2xl mt-10 mb-1'>Top 10 Category</h1>
      <TableContainer component={Paper} sx={{ backgroundColor: "#111827" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {categoryHeaders?.map((header, index) => (
              <TableCell
                key={index}
                sx={{ color: "#F59E0B", fontSize: "13px" ,textAlign: 'center' }}
              >
                {header.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {topCategory?.map((list, index) => (
            <TableRow key={index}>
              {categoryHeaders?.map((header, headerIndex) => (
                <TableCell
                  key={headerIndex}
                  sx={{ color: "white", fontSize: "11px" ,textAlign: 'center' }}
                >
                  {list[header.key]}
                </TableCell>
              ))}
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}

export default AdminDashboard
