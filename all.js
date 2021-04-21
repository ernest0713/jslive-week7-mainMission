let data = [];
let allArea = [];
//地址篩選
const serch = document.querySelector('#serch');
const serchTotal = document.querySelector('#serchTotal');
//套票資訊卡片
const showList = document.querySelector('#showList');
//新增套票按紐
const addTicket = document.querySelector('#add');
//form data 元素綁定
const form = document.querySelector('.addTicketForm');
const ticketName = document.querySelector('#ticketName');
const imgUrl = document.querySelector('#imgUrl');
const area = document.querySelector('#location');
const description = document.querySelector('#description');
const manySet = document.querySelector('#manySet');
const money = document.querySelector('#money');
const star = document.querySelector('#star');
const inputGroup = document.querySelectorAll("input[type='text'],input[type='number'],input[type='url'], textarea");


//驗證條件設定
const constraints  = {
    ticketName: {
        presence: {
            message: '^未填寫'
        }
    },
    imgUrl: {
        presence: {
            message: '^未填寫',
            allowEmpty: false
        },
        url: {
            schemes: ["http", "https"],
            message: '^網址格式錯誤'
        }
    },
    money: {
        presence: {
            message: '^未填寫'
        },
        numericality: {
            onlyInteger: true,
            notValid: '^請輸入正確數字'
        }
    },
    manySet: {
        presence: {
            message: '^未填寫'
        },
        numericality: {
            onlyInteger: true,
            notValid: '^請輸入正確數字',
            notInteger: '^請輸入正確數字',
            greaterThan: 0,
            lessThanOrEqualTo: 999,
            notLessThanOrEqualTo: '^上限999組',
            notGreaterThan: '^至少要有1組'
        }
    },
    star: {
        presence: {
            message: '^未填寫'
        },
        numericality: {
            onlyInteger: true,
            notValid: '^請輸入正確數字',
            greaterThan: 0,
            lessThanOrEqualTo: 10,
            notLessThanOrEqualTo: '^最多10顆星',
            notGreaterThan:'^至少要有1顆星'
        }
    },
    description: {
        presence: {
            message: '^介紹一下吧！'
        },
    }

}

//form data reset
function reset() {
    inputGroup.forEach(function (item) {
        // console.log(item);
        item.value = "";
    })
    isEmpty = false;
}

function checkFormData(){

    for (let i = 0; i < inputGroup.length; ++i) {
        inputGroup.item(i).addEventListener("change", function(e) {
          let err = validate(form, constraints) || {};
          if(!validate.isEmpty(err)) {
            e.target.nextElementSibling.textContent = err[e.target.name];
          } else {
            form.querySelectorAll('.messages').forEach(i => i.textContent = null);
          }
            // console.log(validate({ticketName: 3423}, constraints));
            console.log(err);
        });
    }
}

//新增套票
function addTicketData(e) {
    e.preventDefault();
    //資料寫入
    let newData = {};
    newData.id = data.length;
    newData.name = ticketName.value;
    newData.imgUrl = imgUrl.value;
    newData.area = area.value;
    newData.description = description.value;
    newData.group = parseInt(manySet.value, 10);
    newData.price = parseInt(money.value, 10);
    newData.rate = parseInt(star.value, 10);
    // console.log(newData);
    data.push(newData);
    // console.log(data);

    chartLoad();
    render(data);
    reset();
    console.log(`新增套票"${newData.name}"成功！`)
}
function showDataLen(num){
    serchTotal.textContent = `本次搜尋共 ${data.length} 筆資料`;
}

function render(data) {
    let list = ``;
    data.forEach(function(item){
        list += `
        <li class="col-lg-4 col-sm-12 col-md-6 mb-4">
            <div class="card">
                <div class="position-relative">
                <img src="${item.imgUrl}" class="card-img-top" alt="#">
                <div class="card-location">${item.area}</div>
                <div class="card-score">${item.rate}</div>
            </div>
            
            <div class="card-body pt-4">
                <h5 class="card-title customTextPrimaryColor h5 mb-3">${item.name}</h5>
                <p class="card-text mb-4 customTextSecColor">${item.description}</p>
                <div class="d-flex justify-content-between">
                    <div class="d-flex align-items-center customTextPrimaryColor">
                        <span class="material-icons h6 mb-0">
                        error
                        </span>
                        <p class="h6 mb-0">剩下最後${item.group}組</p>
                    </div>
                        <div class="d-flex align-items-center customTextPrimaryColor">
                            <span>TWD</span>
                            <p class="h2 mb-0">$${item.price}</p>
                        </div>
                    </div>
                </div>
            </div>
        </li>`;
    });
    showDataLen(data.length);
    // serchTotal.textContent = `本次搜尋共 ${data.length} 筆資料`;
    showList.innerHTML = list;
}

function areaFilter(e){
    let str = e.target.value;
    if(str === "全部" ){
        render(data);
    } else {
        let newData = data.filter( item => item.area === str);
        render(newData);
    }
}
function chartLoad(){
    let col = [];
    //算出有多少不同區域
    data.forEach((i)=>{
        //這裡使用三元運算子
        allArea.some( v => {return  i.area === v})?
        null : allArea.push(i.area);
    })
    // console.log(allArea);

    //算出每個區域有多少筆資料
    allArea.forEach((i)=>{
        let num = data.filter(v => v.area === i).length;
        // console.log([i, num]);
        col.push([i, num]);
    })
    // console.log(col);
    // 圖表生成
    let chart = c3.generate({
        bindto: '#chart',
        data: {
            columns: col,
            type : 'donut',
            // onclick: function (d, i) { console.log("onclick", d, i); },
            // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        donut: {
            title: "套票地區比重"
        }
    });
}
function init(){
    //取得套票資訊
    axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
        .then((res) => {
            //新增進套票
            res.data.data.forEach((item) => {
                data.push(item);
            });
            //card list render
            render(data);
            
            // console.log(data);
            chartLoad();
        });
        
    //選擇地區執行areaFilter分類
    serch.addEventListener('change', areaFilter);
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        let err = validate(form, constraints) || {};
        if(!validate.isEmpty(err)) {
            inputGroup.forEach(item=>{
                item.nextElementSibling.textContent = err[item.name];
            });
        } else {
            addTicketData(e);
        }
            
    })
    checkFormData();
}


init();

