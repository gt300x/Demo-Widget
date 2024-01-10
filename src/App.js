import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";


const imageList = [
  {
    url: "/img/123.jpg",
    address: "Tselinogradskaya 40 Kharkiv"
  },
  {
    url: "/img/234.jpg",
    address: "Tselinogradskaya 40 Kharkiv"
  },
  {
    url: "/img/345.jpg",
    address: "Tselinogradskaya 40 Kharkiv"
  },
  {
    url: "/img/456.jpg",
    address: "Tselinogradskaya 40 Kharkiv"
  },
  {
    url: "/img/567.jpeg",
    address: "Tselinogradskaya 40 Kharkiv"
  }
]

function App() {

  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    setImageUrl(imageList[0].url);
  }, []);

  const onHandle = () => {
    fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const file = new File([blob], imageUrl.split('/')[imageUrl.split('/').length - 1], {
        type: blob.type
      });
      
      const canvaswidth = Math.floor((window.innerWidth - 48) * 0.7);
      const canvasheight = Math.floor((window.innerHeight - 160));
      const formData = new FormData();
      formData.append('image', file);
      formData.append('email', "boleinikov95@gmail.com");
      formData.append('address', "Tselinogradskaya 40 Kharkiv");
      formData.append('width', canvaswidth);
      formData.append('height', canvasheight);
      
      axios.post(`https://homekynd.net/create_floor`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          },
          
      })
      .then((result) => {
        formData.append('floor', result.data.message);
        axios.post('https://room-env.vercel.app/api/v1/widget', formData)
        .then(({data}) => {
          
          if(data.data.enable){

            if (document.getElementById("Homekynd-modal")){
              document.getElementById("homekynd-iframe").src = data.data.iframeUrl;
              document.getElementById("Homekynd-modal").style.display = "block";

            } else {
              const bodyContainer = document.body;
              const iframe = document.createElement('iframe');

              // Set iframe attributes
              iframe.src = data.data.iframeUrl;  // Replace with your iframe URL
              iframe.width = '100%';
              iframe.height = '100%';
              iframe.id = "homekynd-iframe";
              // iframe.frameBorder = '0';
              iframe.allowFullscreen = true;

              const modalContainer = document.createElement('div');
              modalContainer.className = 'modal homekynd-modal';
              modalContainer.tabIndex = -1;
              modalContainer.role= "dialog";
              modalContainer.style.width = "100%";
              modalContainer.style.height = "100%";
              modalContainer.style.position = "absolute";
              modalContainer.style.top = "0";
              modalContainer.style.left = "0";
              modalContainer.style.overflow = "hidden";
              modalContainer.id = "Homekynd-modal";

              const modalDialog = document.createElement('div');
              modalDialog.className = 'modal-dialog';
              modalDialog.role = "document";
              modalDialog.style.position = "absolute";
              modalDialog.style.top = "16px";
              modalDialog.style.left = "0";
              modalDialog.style.width = "100%";
              modalDialog.style.height = "100%";              
              modalDialog.style.background = "#000000ee";

              const modalContent = document.createElement('div');
              modalContent.className = "modal-content";
              modalContent.style.width = "100%";
              modalContent.style.height = "100%";

              const modalHeader = document.createElement('div');
              modalHeader.className = "modal-header";

              const modalButton = document.createElement('button');
              modalButton.className = "close";
              modalButton.type = "button";
              modalButton.style.position = "absolute";
              modalButton.style.top = "10px";
              modalButton.style.right = "10px";
              modalButton.textContent = 'X';

              const modalBody = document.createElement('div');
              modalBody.className = "modal-body";
              modalBody.style.width = "100%";
              modalBody.style.height = "100%";
              
              modalHeader.appendChild(modalButton);
              modalBody.appendChild(iframe);


              modalContent.appendChild(modalHeader);
              modalContent.appendChild(modalBody);
              modalDialog.appendChild(modalContent);
              modalContainer.appendChild(modalDialog);
              bodyContainer.appendChild(modalContainer);

              modalButton.addEventListener('click', () => {
                // modalContainer.style.display = "none";
                document.getElementById("Homekynd-modal").style.display = "none";
              })
            }
          }
        })

      });
    });

  }

  const onChangeItem = (item_index) => {
    setImageUrl(imageList[item_index].url);
  }

  return (
    <div className="App">
      <div className="App-container">
        <div className="left">
          <div className="item-list">
            {
              imageList.map((item, i) => {
                return(<ImageItem key={i} itemUrl={item.url} item_index={i} onChangeItem={onChangeItem}/>)
              })
            }
          </div>
        </div>
        <div className="right">
          <img src={imageUrl} className="image-content"/>
          <div className='icon' onClick={onHandle}>
            <img src="/icon.png" width={100}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ImageItem = ({itemUrl, item_index, onChangeItem}) => {
  
  const onHandle = () => {
    onChangeItem(item_index);
  }
  return (
    <div className="item" key={item_index} onClick={onHandle} >
      <img src={itemUrl} alt="item" />
    </div>
  )
}

export default App;
