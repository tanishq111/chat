const Card = ({children}) => {
   return (
     /** Card component wrapper */
     <div style={{ border: "10px solid #121111", borderRadius: 8, padding: 16, margin: 8 }}>
       {children}
     </div>
   );
};

export default Card;