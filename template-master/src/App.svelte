<script>
	import axios from "axios";
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	

	let user = null;

	let todoss = [];

	let activePage = "home";
	

	if (localStorage.getItem('user')) {
		user = JSON.parse(localStorage.getItem('user'));
	}

	/*if (user) {
		axios.get("/todos/" + user.id).then(response => {
			let _todos = response.data.todos.map(todo => {
				return {
					id: todo.id,
					done: todo.is_completed,
					description: todo.text
				};
			})

			todos = _todos;
		});
	}*/

	

	

	


	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	let todos = [];

	
	
	
	
	let uid = todos.length + 1;

	function add(input) {
		const todo = {
			id: uid++,
			done: false,
			description: input.value
		};

		axios.post("/todos", {
			user_id: user.id,
			text: input.value
		});

		todos = [todo, ...todos];
		input.value = '';
	}

	function remove(todo) {
		todos = todos.filter(t => t !== todo);
		axios.post("/todos/" + todo.id + "/delete");
	}

	function changeStatus(todo_id, new_status) {
		axios.post("/todos/" + todo_id, {
			is_completed: new_status
		});
	}


	function handleLogin(event) {
		event.preventDefault();
		const username = document.getElementById("username").value;
		const password = document.getElementById("password").value;

		axios.post("/account/login", {
			username: username,
			password: password
		}).then(response => {
			if (response.data.success) {
				user = response.data.user;
				localStorage.setItem("user", JSON.stringify(user));
				console.log(user);
				
				alert(user.id);
				activePage = "todo";
				if (user) {
					axios.get("/todos/" + user.id).then(response => {
					let _todos = response.data.todos.map(todo => {
						return {
							id: todo.id,
							done: todo.is_completed,
							description: todo.text
						};
					})

					todos = _todos;
					});
				}

				if (user) {
					axios.get("/todos/" + user.id + "/deleted").then(response => {
					let _todos = response.data.todos.map(todo => {
						return {
							id: todo.id,
							done: todo.is_completed,
							description: todo.text
						};
					})

					todoss = _todos;
					});
				}
			}else{
				alert("Yanlis girdiniz!!!");
			}
		});
	}

	

	function handleRegister(event) {
		event.preventDefault();
		const username = document.getElementById("register_username").value;
		const password = document.getElementById("register_password").value;

		axios.post("/account/register", {
			username: username,
			password: password
		}).then(response => {
			console.log(response.data);
			if (response.data.success) {
				activePage = "home";
				alert("You can login");
			}
		});
	}

	function handleLogout() {
		user = null;
		localStorage.removeItem("user");
		activePage = "home";
		todoss = [];
		todos = [];
	}

	function handleDeletedTodos() {
		axios.get("/todos/" +user.id+"/deleted")
		.then(response => {
			let _todos = response.data.todos.map(todo => {
				return {
					id: todo.id,
					done: todo.is_completed,
					description: todo.text
				};
			})

			todos = _todos;
		});
	}
	function handleActiveTodos() {
		axios.get("/todos/" +user.id)
		.then(response => {
			let _todos = response.data.todos.map(todo => {
				return {
					id: todo.id,
					done: todo.is_completed,
					description: todo.text
				};
			})

			todos = _todos;
		});
	}

	
	function activePageRegister(){
		activePage = "register";
	}
	

	

</script>

<!-- svelte-ignore css-unused-selector -->
<main>
	
   <!--LOGIN SCREEN -->

   {#if activePage == "todo"}
<!-- CSS only -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

   <div class='board'>
	<div class="d-flex justify-content-around align-items-center mt-2">
		<div>{user.username}</div>
		<button class="btn btn-primary mr-2" on:click={handleActiveTodos}>Active Todos</button>
		<button class="btn btn-info mr-2" on:click={handleDeletedTodos}>Deleted Todos</button>
		<button class="btn btn-danger" on:click={handleLogout}>Logout</button>
		<input type="submit" value="Logout" on:click={handleLogout} class="btn btn-danger">
	</div>

	<div class="d-flex justify-content-around align-items-center mt-2"> <p class="text-default" >MY LİST</p> </div>

	<input
		class="new-todo"
		placeholder="what needs to be done?"
		on:keydown="{event => event.key === 'Enter' && add(event.target)}"
	>

	<div class='left'>
		<h2>todo</h2>
		{#each todos.filter(t => !t.done) as todo (todo.id)}
			<label
				on:click="{() => changeStatus(todo.id, 1)}"
				in:receive="{{key: todo.id}}"
				out:send="{{key: todo.id}}"
				animate:flip
			>
				<input type=checkbox bind:checked={todo.done}>
				{todo.description}
				<button on:click="{() => remove(todo)}">x</button>
			</label>
		{/each}
	</div>

	<div class='right'>
		<h2>done</h2>
		{#each todos.filter(t => t.done) as todo (todo.id)}
			<label
				on:click="{() => changeStatus(todo.id, 0)}"
				in:receive="{{key: todo.id}}"
				out:send="{{key: todo.id}}"
				animate:flip
				
			>
				<input type=checkbox bind:checked={todo.done}>
				{todo.description}
				<button on:click="{() => remove(todo)}">x</button>
			</label>
		{/each}
	</div>

	<div class='right down'>
		<h2>delete todos</h2>
		{#each todoss.filter(t => t.done) as todo (todo.id)}
			<label
				on:click="{() => changeStatus(todo.id, 0)}"
				in:receive="{{key: todo.id}}"
				out:send="{{key: todo.id}}"
				animate:flip
				
			>
				
				{todo.description}
				
			</label>
		{/each}
	</div>


</div>

   {:else if activePage == "home"}
	<!--Bootsrap 4 CDN-->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    
    <!--Fontawesome CDN-->
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
	
	<div class="container">
		<div class="d-flex justify-content-center h-100">
			<div class="card">
				<div class="card-header">
					<h3>Login</h3>
					
				</div>
				<div class="card-body">
					<form action="" on:submit={handleLogin}>
						<div class="input-group form-group">
							<div class="input-group-prepend" >
								<span class="input-group-text"><i class="fas fa-user"></i></span>
							</div>
							<input type="text" id="username" class="form-control" placeholder="username">
							
						</div>
						<div class="input-group form-group">
							<div class="input-group-prepend">
								<span class="input-group-text"><i class="fas fa-key"></i></span>
							</div>
							<input type="password" id="password" class="form-control" placeholder="password">
						</div>
						<div class="form-group" >
							<input type="submit" value="Login" class="btn float-right login_btn">
						</div>
					</form>
				</div>
				<div class="card-footer">
					<div class="d-flex justify-content-center links">
						Don't have an account?<a href="#" on:click={activePageRegister}>Sign Up</a>
					</div>
					
				</div>

			</div>
		</div>
	</div>


	{:else if activePage == "register"}
	<div class="container">
	<div class="d-flex justify-content-center h-100">
		<div class="card">
			<div class="card-header">
				<h3>Register</h3>
				
			</div>
			<div class="card-body">
				<form action="" on:submit={handleRegister} >
					
					
                    <div class="input-group form-group">
						<div class="input-group-prepend">
							<span class="input-group-text"><i class="fas fa-user-tie"></i></span>
						</div>
						<input type="text" id="register_username" class="form-control" placeholder="Username">
                    </div>
                    
                    <div class="input-group form-group">
						<div class="input-group-prepend">
							<span class="input-group-text"><i class="fas fa-key"></i></span>
						</div>
						<input id="register_password" type="password" class="form-control" placeholder="password">
                    </div>
				
                    <div class="form-group">
						<input type="submit" value="Register" class="btn float-right login_btn">
					</div>
				</form>
			</div>
			
		</div>
	</div>
</div>
{/if}




	


</main>

<style>

@import url('https://fonts.googleapis.com/css?family=Numans');

main{
margin: 0;
padding: 0;

background-size: cover;
background-repeat: no-repeat;
height: 100%;
font-family: 'Numans', sans-serif;
}

.container{
	background-image: url('http://getwallpapers.com/wallpaper/full/a/5/d/544750.jpg');
height: 100%;
align-content: center;

}

.card{
height: 370px;
margin-top: auto;
margin-bottom: auto;
width: 400px;
background-color: rgba(0,0,0,0.5) !important;
}

.social_icon span{
font-size: 60px;
margin-left: 10px;
color: #FFC312;
}

.social_icon span:hover{
color: white;
cursor: pointer;
}

.card-header h3{
color: white;
}

.social_icon{
position: absolute;
right: 20px;
top: -45px;
}

.input-group-prepend span{
width: 50px;
background-color: #FFC312;
color: black;
border:0 !important;
}

input:focus{
outline: 0 0 0 0  !important;
box-shadow: 0 0 0 0 !important;

}

.remember{
color: white;
}

.remember input
{
width: 20px;
height: 20px;
margin-left: 15px;
margin-right: 5px;
}

.login_btn{
color: black;
background-color: #FFC312;
width: 100px;
}

.login_btn:hover{
color: black;
background-color: white;
}

.links{
color: white;
}

.links a{
margin-left: 4px;
}



.new-todo {
		font-size: 1.4em;
		width: 100%;
		margin: 2em 0 1em 0;
	}

	.board {
		max-width: 36em;
		margin: 0 auto;
	}

	.left, .right {
		float: left;
		width: 50%;
		padding: 0 1em 0 0;
		box-sizing: border-box;
	}

	

	h2 {
		font-size: 2em;
		font-weight: 200;
		user-select: none;
	}

	label {
		top: 0;
		left: 0;
		display: block;
		font-size: 1em;
		line-height: 1;
		padding: 0.5em;
		margin: 0 auto 0.5em auto;
		border-radius: 2px;
		background-color: #eee;
		user-select: none;
	}

	input { margin: 0 }

	.right label {
		background-color: rgb(180,240,100);
	}

	button {
		float: right;
		height: 1em;
		box-sizing: border-box;
		padding: 0 0.5em;
		line-height: 1;
		background-color: transparent;
		border: none;
		color: rgb(170,30,30);
		opacity: 0;
		transition: opacity 0.2s;
	}

	label:hover button {
		opacity: 1;
	}


</style>