import React from 'react'
import './App.css';

const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
const stonksUrl = `${proxyUrl}https://query1.finance.yahoo.com/v8/finance/chart/GME?region=US&lang=en-US&includePrePost=false&interval=15m&range=5d&corsDomain=search.yahoo.com`
const getStonks = async()=>{
  const response = await fetch(stonksUrl)
  return response.json()
}

function App() { 
  const [price, setPrice] = React.useState(0)
  const [priceTime, setPriceTime] = React.useState(null)
  React.useEffect(() => {
    let timeoutId
    const getLatestPrice= async()=>{
      const data = await getStonks()
      const meta = data.chart.result[0].meta
      setPrice(meta.regularMarketPrice)
      setPriceTime(new Date(meta.regularMarketTime * 1000))
      timeoutId = setTimeout(getLatestPrice, 5000) 
    }
    setTimeout(getLatestPrice, 5000 * 2) 
    return ()=>{
      clearTimeout(timeoutId)
    }
    
  })
  
  return (
    <>
    <div className="price">
      ${price}
     
    </div>
     {priceTime && priceTime.toLocaleTimeString()}
    </>
    
  );
}

export default App;
