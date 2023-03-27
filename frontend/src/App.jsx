import { useEffect, useState } from 'react'
import send from './assets/send.svg';
import user from './assets/user.png';
import loadingIcon from './assets/loader.svg';
import bot from './assets/bot.png';
import { fetchDataBotResponse } from './utils/api';
import axios from 'axios';


// let arr = [
//   {type: "user", posts: "Anim excepteur commodo dolor ad cupidatat"},
//   {type: "bot", posts: "Anim excepteur commodo dolor ad cupidatat"}
// ]


function App() {
	const [input, setInput] = useState("");  
	const [dataPost, setDataPost] = useState([]);    ///thiết lập trạng ban đầu của dataPost là mảng rỗng


	useEffect(()=>{
		document.querySelector(".layout").scrollTop = document.querySelector(".layout").scrollHeight;
	}, [dataPost]);


	// const fetchDataBotResponse = async()=>{
	//   const {data} = await axios.post(
	//       'http://localhost:4000',
	//       {input},
	//       {headers: {"Content-Type": "application/json"}}
	//   );
	//   return data;
	// }
  

	const handleSubmit = ()=>{
		if (input.trim() === "") {     ///trim() xóa khoảng trắng ở đầu và cuối của từ hoặc chuỗi
			return;    ///mã sau if() sẽ không đc thực thi nếu đk true
		}
		updateDataPost(input);   ///cập nhật lại dataPost; đối số input tương ứng với tham số posts
		setInput("");    ///delete input
		updateDataPost("loading...", false, true);  ///sau khi onClick() hoặc Enter thì thiết lập trạng thái cho bot
		//tạo đối tượng chứa đối tượng bot là thuộc tính và đc trả về từ server.js
		fetchDataBotResponse(input).then((res)=>{     ////lấy dữ liệu từ api
			console.log(res);    
			updateDataPost(res?.bot?.trim(), true);    ////tương ứng với tham số là isBot và loading
		});
	}


	const autoTipingBotResponse = (posts)=>{
		let index = 0;  ///giá trị ban đầu của biến là 0
		///setInterval() dùng để gọi hàm trong khoảng thời gian 30 miliseconds cho đến khi clearInterval() dc thực thi
		let interval = setInterval(()=>{   
			if(index < posts?.length) {   ///độ dài chuỗi
				setDataPost((prevState)=>{
					let lastElement = prevState.pop();   ///xóa phần tử cuối cùng trong mảng dataPost và trả lại phần tử đó
					if(lastElement?.type !== "bot") {   ///nếu phần tử cuối cùng không phải của bot
						prevState.push({    ///thêm phần tử vào cuối mảng
							type: "bot",
							///truy cập tới kí tự có chỉ mục -1 của chuỗi, vì chuỗi trả về từ bot có kí tự trắng phái trước
							posts: posts.charAt(index - 1)  
						});
					} else {   ///nếu là của bot
						prevState.push({
							type: "bot",
							posts: lastElement.posts + posts.charAt(index - 1)  ///kí tự trước đó + với kí tự tiếp theo
						});
					}

					return ([...prevState]);
				});

				index ++;    ///tăng chỉ mục index

			} else {
				clearInterval(interval);
			}
		}, 30);
	}


	const updateDataPost = (posts, isBot, loading)=>{
		if(isBot) {
			autoTipingBotResponse(posts);
		} else {
			///lấy trạng thái hiện tại (trước đó) của dataPost và sử dụng toán tử trải rộng để nối thêm phần tử mới vào mảng
			setDataPost((prevState)=>{    
			///{type: "user", posts} trả về mảng gồm 2 thuộc tính;
			return ([...prevState, {type: loading?"loading":"user", posts: posts}]);   
		});
		}
	}


	const onKeyUp = (e)=>{
		if(e.key === "Enter" || e.which === 13) {    ///mã key 13 tương ứng với phím Enter
			handleSubmit();
		}
	}
  

	return (
		<main className="chatGPT-app">
			<section className="chat-container">
				<div className="layout">
					{dataPost.map((dataElement, index)=>(
						<div key={index} className={`chat-bubble ${dataElement.type === "bot" || dataElement.type === "loading"?"bot":""}`}>

						<div className="avatar">
							{
								dataElement.type === "bot" || dataElement.type === "loading" ? (
									<img src={bot} alt="" />
								) : (
									<img className="user" src={user} alt="" />
								)
							}
							{/* <img src={dataElement.type === "bot" || dataElement.type === "loading"?bot:user} alt="" /> */}
						</div>

						{
						dataElement.type === "loading" ? (
							<div className="loader">
								<img src={loadingIcon} alt="" />
							</div>
						) : (
							<div className="post">{dataElement.posts}</div>
						)
						}

						
					</div>
					))}  
				</div>
			</section>

			<footer>
				{/* thiết lập phím nóng bằng onKeyUp={}; sự kiện onChange() đc kích hoạt mỗi khi đầu vào bị thay đổi */}
				<input type="text" className="composebar" autoFocus value={input} placeholder="Ask anything!" onChange={(e)=>setInput(e.target.value)} onKeyUp={onKeyUp} />
				<div className="send-button" onClick={handleSubmit}>
					<img src={send} alt="" />
				</div>
			</footer>
		</main>
	)
}

export default App
