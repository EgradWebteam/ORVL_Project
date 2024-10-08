// import React from 'react';

// const PaymentPage = ({ userInfo, handleInputChange, handleFormSubmit, handleCloseModal }) => {
//     return (
//         <div className="modal">
//             <div className="modal-content mcposition">
//                 <h2>Enter Your Details</h2>
//                 <form onSubmit={handleFormSubmit} className='paymentformflex'>
//                     <input 
//                         type="text" 
//                         name="name" 
//                         placeholder="Your Name" 
//                         value={userInfo.name} 
//                         onChange={handleInputChange}
//                         className='inputfpem inputpayment' 
//                         required 
//                     />
//                     <input 
//                         type="email" 
//                         name="email" 
//                         placeholder="Your Email" 
//                         value={userInfo.email} 
//                         onChange={handleInputChange}
//                         className='inputfpem inputpayment' 
//                         required 
//                     />
//                     <input 
//                         type="tel" 
//                         name="phone" 
//                         placeholder="Your Phone Number" 
//                         value={userInfo.phone} 
//                         onChange={handleInputChange} 
//                         className='inputfpem inputpayment'
//                         required 
//                     />
//                     <div className='btnflex'>
//                         <button type="submit" className='lgnemailexist'>Proceed to Payment</button>
//                         <button type="button" onClick={handleCloseModal} className='lgnemailexist'>Cancel</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default PaymentPage;
