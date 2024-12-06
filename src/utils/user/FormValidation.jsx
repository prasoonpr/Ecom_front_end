export const validateRegisterForm = input => {
    const errors = {}
  
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    // const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const passwordRegex =/^.{8,}$/
     
  
    if (!input.firstName || input.firstName.trim()=='') {
      errors.firstName = 'Name is required*'
    }
    if (!input.lastName || input.lastName.trim()=='') {
        errors.lastName = 'Name is required*'
      }
    if (!input.email) {
      errors.email = 'Email is required*'
    } else if (!emailRegex.test(input.email)) {
      errors.email = 'Invalid email format'
    } else if (input.email !== input.email.toLowerCase()) {
      errors.email = 'Email must be in all lowercase'
    }
  
    if (!input.password) {
      errors.password = 'Password is required*'
      } else if (!passwordRegex.test(input.password)) {
        errors.password = 'Password must be at least 8 characters'
    }
  
   
  
    return errors
  }

  export const validateAddressform=input=>{
    if(input.name.trim()==''){
      return false
    }
    if(input.phone==''||isNaN(input.phone)){
      return false
    }
    if(input.pincode==''||isNaN(input.phone)){
      return false
    }
    if(input.locality.trim()==''){
      return false
    }
    if(input.address.trim()==''){
      return false
    }
    if(input.city.trim()==''){
      return false
    }
    if(input.state.trim()==''){
      return false
    }
    if(input.alternativePhone==''||isNaN(input.alternativePhone)){
      return false
    }
    return true
  }