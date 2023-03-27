import { useEffect, useState } from 'react'
import send from './assets/send.svg';
import user from './assets/user.png';
import loadingIcon from './assets/loader.svg';
import bot from './assets/bot.png';
import { fetchDataBotResponse } from './utils/api';
import axios from 'axios';



function App() {
	const [input, setInput] = useState("");  
	const [dataPost, setDataPost] = useState([]);  


	useEffect(()=>{
		document.querySelector(".layout").scrollTop = document.querySelector(".layout").scrollHeight;
	}, [dataPost]);


	const handleSubmit = ()=>{
		if (input.trim() === "") {    
			return;    
		}
		updateDataPost(input);   
		setInput("");    
		updateDataPost("loading...", false, true);
		fetchDataBotResponse(input).then((res)=>{ 
			console.log(res);    
			updateDataPost(res?.bot?.trim(), true);
		});
	}


	const autoTipingBotResponse = (posts)=>{
		let index = 0;  
		let interval = setInterval(()=>{   
			if(index < posts?.length) {  
				setDataPost((prevState)=>{
					let lastElement = prevState.pop();  
					if(lastElement?.type !== "bot") {   
						prevState.push({    
							type: "bot",
							posts: posts.charAt(index - 1)  
						});
					} else {   
						prevState.push({
							type: "bot",
							posts: lastElement.posts + posts.charAt(index - 1)  
						});
					}

					return ([...prevState]);
				});

				index ++;    

			} else {
				clearInterval(interval);
			}
		}, 30);
	}


	const updateDataPost = (posts, isBot, loading)=>{
		if(isBot) {
			autoTipingBotResponse(posts);
		} else {
			setDataPost((prevState)=>{    
			return ([...prevState, {type: loading?"loading":"user", posts: posts}]);   
		});
		}
	}


	const onKeyUp = (e)=>{
		if(e.key === "Enter" || e.which === 13) { 
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
				<input type="text" className="composebar" autoFocus value={input} placeholder="Ask anything!" onChange={(e)=>setInput(e.target.value)} onKeyUp={onKeyUp} />
				<div className="send-button" onClick={handleSubmit}>
					<img src={send} alt="" />
				</div>
			</footer>
		</main>
	)
}

export default App
