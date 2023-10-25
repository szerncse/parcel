import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { data } from 'autoprefixer';
import { error } from 'console';


interface Company {
   International: string;
   Code: string;
   Name: string;
}
interface themeColor {
  [key: string] : {
    back: string;
    hover: string;
    active: string;
    text: string;
    outline: string;
  }
}
interface ButtonType {
  name: string;
  theme: string;
}

function App() {

const [carriers, setCarriers] = useState<Company[]>([]);
const [allCarrlers, setAllcarriers] = useState<Company[]>([]);
const [theme, setTheme] = useState<string>('default');

const [tcode, setTcode] = useState<string>('04');
const [tinvoice, setTinvoce] = useState<string>('');
const [tname, setTname] = useState<string>('CJ대한통운');
const [isBtn, setIsBtn] = useState<number | null>(null);
const [infoTracking, setInfoTracking] = useState<string>();



const themeColor :themeColor = {
  "default":{
    "back": "bg-indigo-500",
    "hover": "hover:bg-indigo-300",
    "active": "bg-indigo-400",
    "text": "text-indigo-500",
    "outline" : "outline-indigo-300"
  },
  "orange":{
    "back": "bg-orange-500",
    "hover": "hover:bg-orange-300",
    "active": "bg-orange-400",
    "text": "text-orange-500",
    "outline" : "outline-orange-300"
  },
  "blue":{
    "back": "bg-blue-500",
    "hover": "hover:bg-blue-300",
    "active": "bg-blue-400",
    "text": "text-blue-500",
    "outline" : "outline-blue-300"
  }
}

const buttons :ButtonType[] = [
  {name: "기본", theme: "default"},
  {name: "오렌지", theme: "orange"},
  {name: "블루", theme: "blue"},
]

useEffect(()=>{
  const fetchData = async () =>{
    try{
      const res = await fetch(`
      http://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.REACT_APP_API_KEY}`)
      const data = await res.json();
       console.log(data)
       setCarriers(data.Company);
       setAllcarriers(data.Company);

    }catch(error){
      console.log(error);
    }
  }

  fetchData()
},[])


const selectcode = (BtnNumber: number, code : string, name : string)=>{
  setIsBtn(BtnNumber);
  setTcode(code);
  setTname(name);


  const isInternational = BtnNumber === 2 ? 'true' : 'false';
  
  const filterCarriers = allCarrlers.filter(e => e.International === isInternational);
  setCarriers(filterCarriers)
}

const blindNumber = (e: React.ChangeEvent<HTMLInputElement>)=>{
  const value = e.target.value;
  e.target.value = e.target.value.replace(/[^0-9]/g,'')
  setTinvoce(value);
}
// 조회하기
const postsubmit = async ()=>{

  // const url = new URL(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_invoice=406400763145&t_code=08&t_key=0b0EZTmRVNRf9lGpwtx1yw`)


  // const url = new URL(`"http://info.sweettracker.co.kr/api/v1/trackingInfo"`);
  // url.searchParams.append("t_code", tcode);
  // url.searchParams.append("t_invcoice", tinvoice);
  // url.searchParams.append("t_key", `$process.env.REACT_APP_API_KEY`);


  try{

    const res = await fetch(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_invoice=${tinvoice}&t_code=${tcode}&t_key=${process.env.REACT_APP_API_KEY}`);
    const data = res.json();
    console.log(data)

  }catch(error){
    console.log(error);
  }
  // console.log(tcode, tinvoice)
}

  return (
    <>

    <div className={`${themeColor[theme].back} p-5 text-black 
    text-sm md:text-xl xl:text-2xl flex justfy-between`}>
   <h3 className='font-extrabold'>국내,외 택배조회 시스템</h3>
    <div>
      <span>테마 :</span>
      {
        buttons.map((e,i)=>{
          return(
            <button onClick={()=> setTheme(e.theme)} key={i} className="mx-l md:mx-2 xl:mx-3">{e.name}</button>
          )
        })
      }
      </div>
    </div>

    <div className="w-4/5 md:w-3/5 xl:w-3/12 mx-auto my-40 flex rounded items-center flex-wrap">
  <div className="border-b basis-full py-2 flex justify-center items-center text-sm">
  <span className='basis-[30%] text-center mr-5'>국내 / 국외 선택</span>
  <button className={`text-sm border p-1 px-5 rounded hover:text-white mr-4
   ${isBtn === 1 ? 'text-white' : 'text-black'}
    ${themeColor[theme].hover} ${isBtn === 1 ? themeColor[theme].active: ''}`} onClick={()=>{ selectcode(1, '04', 'cj대한통운')}}>국내</button>
  <button className={`text-sm border p-1 px-5 rounded hover:text-white mr-4
   ${isBtn === 2 ? 'text-white' : 'text-black'} 
   ${themeColor[theme].hover} ${isBtn === 2 ? themeColor[theme].active: ''}`} onClick={()=>{ selectcode(2, '12', 'EMS')}}>국외</button>
</div>

<div className="basis-full pt-4 border-b ">


<select value={tcode}  onChange={(e)=>{setTcode(e.target.value)}}>
 {
  carriers.map((e,i)=>{
    return(
      <option key={i} value={e.Code}>{e.Name}</option>
    )
  })
 }
</select>
</div>


<div className="basis-full py-4 border-b text-center">
  <input type="text" onInput={blindNumber} placeholder='운송장 번호를 입력해주세요' className='w-full border px-5 py-2 rounded-md {themColor[them].outline}' />
  </div>
</div>
<div className="basis-full border-b py-4 text-center">
  <button className={`${themeColor[theme].back} text-white px-5 py-2 rounded-md w-full`} onClick={postsubmit}>조회하기</button>
</div>
    </>
  );
}

export default App;
