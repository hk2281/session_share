var ex_id = 'dboogpjpkfenfcalbjobljoojgjpicab'
var div=document.createElement("div"); 
document.body.appendChild(div); 
div.innerText="test123";
var head = document.querySelector('body');

// Создаем кнопки
var button1 = document.createElement('button');
button1.textContent = 'Button 1';
button1.id = 'btn_1';
button1.style.zIndex = '9999';
// Добавляем обработчик события для кнопки 1
button1.addEventListener('click', function(event) {
    event.preventDefault();
    chrome.runtime.sendMessage(ex_id, {action: "callExtensionPaste"},
    function(responce){
      console.log('copy to clipboard')  
    })
});


var button2 = document.createElement('button');
button2.textContent = 'Button 2';
button2.id = 'btn_2'
button2.style.zIndex = '9999';
// Добавляем обработчик события для кнопки 2
button2.addEventListener('click', function(event) {
    event.preventDefault();
    chrome.runtime.sendMessage(ex_id,{action: "callExtensionFunction"},
    function(responce){
        console.log('paste success')
    });
});
head.prepend(button1);
head.prepend(button2);



