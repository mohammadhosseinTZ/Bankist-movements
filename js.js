{
  /* <div id="moovement">
<div id="moovId" class =${elem > 0 ? "blue" : "red"}>${
index + 1
}-deposit</div>
<div class="movDate">${moveDate} </div>
<div class="moveprise">${elem}</div>
</div>
`; */
}
const accounts = [
  {
    owner: "Ali Daei",
    movements: [200, -300, 450, -100],
    interestRate: 1.2,
    pin: 1111,
    movementsDates: [
      `2022-11-18T21:21:20.185Z`,
      `2023-09-22T21:21:20.185Z`,
      `2023-09-23T21:21:20.185Z`,
      `2023-09-24T21:21:20.185Z`,
    ],
    currency: "EUR",
    locale: "pt-PT",
  },
  {
    owner: "Garate Bale",
    movements: [300, -100, 750, -70],
    interestRate: 1.2,
    pin: 2222,
    movementsDates: [
      `2022-11-18T21:21:20.185Z`,
      `2023-09-22T21:21:20.185Z`,
      `2023-09-23T21:21:20.185Z`,
      `2023-09-20T21:21:20.185Z`,
    ],
    // currency: "USD",
    // locale: "en-US",
    currency: "IRR",
    locale: "fa-IR",
  },
];

//variables
const loginEl = document.getElementById("login");
const welcomeEL = document.getElementById("welcome");
const mainEl = document.getElementById("main");
const balanceEl = document.getElementById("balance");
const moovementsEl = document.getElementById("moovements");
const incomeEl = document.getElementById("income");
const outcomEl = document.getElementById("outcome");
const interestEl = document.getElementById("interest");
const transferEl = document.getElementById("transfer");
const loansubmitEl = document.getElementById("loansubmit");
const deleteEl = document.getElementById("deleted");
const sortEl = document.getElementById("sort");
const dateEl = document.querySelector(".date");

let currentaccount = {};
//new property
accounts.forEach((elem) => {
  elem.username = elem.owner
    .split(" ")
    .reduce((p, n) => p[0].toLocaleLowerCase() + n[0].toLocaleLowerCase());
});

//submit
loginEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const usernameEl = document.getElementById("username");
  const paswordEl = document.getElementById("pasword");
  const usernameValue = usernameEl.value;
  const paswordValue = +paswordEl.value;
  currentaccount = accounts.find((elem) => {
    return usernameValue === elem.username && paswordValue === elem.pin;
  });
  usernameEl.value = paswordEl.value = "";
  if (!currentaccount) return;
  //welcome
  welcomeEL.textContent = `welcome ${currentaccount.owner.split(" ")[0]}`;
  //pannel
  mainEl.classList.remove("main");
 
  //update All
  update(currentaccount);
  //Transfer
  transfer(currentaccount);
  loan(currentaccount)
  pin (currentaccount)
});
///////////////////////////////////////////////////////////////////////
//currency
function currency(acc, number) {
  return new Intl.NumberFormat(acc.locale, {
    style: "currency",
    currency: acc.currency,
    currencyDisplay: "code",
    useGrouping: false,
  }).format(number);
}
//current Balance
function balance(acc) {
  const balancenumber = acc.movements.reduce((p, n) => p + n);
  balanceEl.textContent = currency(acc, balancenumber);
}
//DateTime
function datetime(acc) {
  dateEl.textContent = new Intl.DateTimeFormat(acc.locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
//movements
function movementsdata(acc , flag=true) {
  let html = "";
  const moves = flag?acc.movements:acc.movements.toSorted((a,b)=>b-a)
  moves.forEach((elem, index) => {
    let dateshow = acc.movementsDates[index];

    html += `<div id="moovement">
    <div id="moovId" class =${elem > 0 ? "blue" : "red"}>${
      index + 1
    }-deposit</div>
    <div class="movDate"> ${Timeofmovements(acc, dateshow)}</div>
    <div class="moveprise">${elem}</div>
    </div>
    `;
  });

  moovementsEl.innerHTML = html;
}
// incomes
function income(acc) {
  let number = acc.movements.filter((elem) => elem > 0).reduce((n, p) => n + p);
  incomeEl.textContent = currency(acc, number);
}
//outcomes
function outcome(acc) {
  let number = acc.movements
    .filter((elem) => elem < 0)
    .reduce((n, p) => Math.abs(n + p));
  outcomEl.textContent = currency(acc, number);
}
// interest
function interest(acc) {
  let number = acc.movements
    .filter((elem) => elem > 0)
    .map((elem) => elem * (acc.interestRate / 100))
    .reduce((n, p) => n + p);
  interestEl.textContent = currency(acc, number);
}
//update All
function update(acc) {
  balance(acc);
  //show date
  datetime(acc);
  //movements
  movementsdata(acc);
  //income
  income(acc);
  //outcomes
  outcome(acc);
  //interst
  interest(acc);
}
//Date
function Timeofmovements(acc, d) {
  let nowday = new Date();
  let pastdays = new Date(d);
  let theTime = Math.trunc(
    Math.abs((nowday - pastdays) / (1000 * 60 * 60 * 24))
  );

  if (theTime === 0) return "TODAY";
  else if (theTime === 1) return "YESTARDAY";
  else if (theTime < 7 && theTime > 2) return "about week ago";
  else
    return new Intl.DateTimeFormat(acc.locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(pastdays);
}
//sort
  let flag = true
  sortEl.addEventListener("click" , ()=>{
    flag=!flag
    
    movementsdata(currentaccount , flag)
  })
//Transfers
// transfer
function transfer(acc) {
  transferEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const toEl = document.getElementById("to");
    const transferamountEl = document.getElementById("transferamount");
    const toValue = toEl.value;
    const transfer_Value = parseFloat(transferamountEl.value);
    const checkout = accounts.find(elem => elem.username ===toValue)
    if(!checkout || !transfer_Value)return
    
    acc.movements.push(-(transfer_Value))
    acc.movementsDates.push(new Date().toISOString())
    checkout.movements.push(transfer_Value)
    checkout.movementsDates.push(new Date().toISOString())
    update(currentaccount)
  })
  
}
//loan
function loan(acc){
  loansubmitEl.addEventListener("submit" , e =>{
    e.preventDefault()
    const amountloanEL = document.getElementById("amountloan")
    const amountloanValue = parseFloat(amountloanEL.value)
    if(amountloanValue){
      acc.movements.push(amountloanValue)
      acc.movementsDates.push(new Date().toISOString())
      update(currentaccount)
    }
  })
}
//pin
function pin (acc){
  deleteEl.addEventListener("submit" , e=>{
    e.preventDefault()
    const deleteacountEl = document.getElementById("deleteacount")
    const deleteacountValue = +deleteacountEl.value
    
    if(deleteacountValue === acc.pin){
      const accountindex =accounts.findIndex(elem => elem.username ===acc.username)
      accounts.splice(1 , 1)
      alert("Your account has been successfully deleted")
      mainEl.classList.add("main");
      welcomeEL.textContent = "pls login";
    }
    
  })
}
