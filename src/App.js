import React, { Component } from 'react';
import logo from './logo.svg';
import './css/App.css';
import {Button, Panel, Tabs, Tab, Grid, Row, Col, PanelGroup, ListGroup, ListGroupItem, Image, Media} from 'react-bootstrap'
import Quiz from './Quiz.js'
import MovieForm from './MovieForm.js'
import {data} from './data/movies.json';
import _ from 'lodash'

const TabsQuiz = (props) => {
	let tabItems = props.tabContents.map((tabContent, idx) => {
		return (
			<Tab eventKey={idx + 1} title={props.tabtitles[idx]}> 
				{tabContent}
			</Tab>
		);
	});

	return (
		<Tabs defaultActiveKey={props.defaultActiveKey} id={props.id} >
			{tabItems}	
		</Tabs>
	);
}

const ListOfMovies = (props) => {
	let listItems = props.movies.map((movie, idx) => {
		let bsStyle = props.selectedMovie && props.selectedMovie.name === movie.name ? 'warning' : null;		
		return (
			<ListGroupItem key={idx} 
				href="#" 
				onClick={props.handleMovieSelected}
				bsStyle={bsStyle}
				data-movie={movie.name}>
				<Media>
					<Media.Left>
						<Image src={movie.imageUrl} img-rounded="true" style={{width: '80px', height: '80px'}} alt="Image" />
					</Media.Left>
					<Media.Body>
						<Media.Heading>
							<Row>
								<Col xs={9} sm={9} md={9} lg={9}>
									{movie.name}
								</Col>
								<Col xs={2} sm={2} md={2} lg={2}>									
									<span className="clickable close-icon" style={{fontSize: '0.8em'}} onClick={props.handleDeleteMovie}>
										<i className="fa fa-times"></i>
									</span>
								</Col>								
							</Row>							
						</Media.Heading>
						<p>{movie.director}</p>
					</Media.Body>
				</Media>

			</ListGroupItem>
		);
	});

	return (
		<ListGroup style={{overflowY: 'auto', maxHeight: '600px'}}>			
			{listItems}
		</ListGroup>
	);
}

const PanelHeader = (props) => {
	return (
		<Row className="text-right" style={{paddingRight: '10px'}}>
			<Button type="button" bsStyle="primary" onClick={props.handleCreateClick}>
				<i className="glyphicon glyphicon-plus"></i>
			</Button>
		</Row>		
	);
}

export default class App extends Component {
	static tabTitles = [
		'Quiz',
		'Add Movie'
	]

	static crudTypeEnum = {
		CREATE : 'create',
		UPDATE : 'update',
		DELETE : 'delete'
	}

	state = {
		movies: data,
		selectedMovie: {},
		crudType: App.crudTypeEnum.CREATE
	}

	getSubmittedData = (movie) => {
		if (!movie) {
			return;
		}
				
		switch (this.state.crudType) {
			case App.crudTypeEnum.UPDATE:
				this.updateMovie(movie);
				break;
			default:
				this.addMovie(movie);
		}
	}

	addMovie = (movie) => {
		let idx = _.findIndex(this.state.movies, {'name' : movie.name});
		if (idx > 0){
			alert(`Movie '${movie.name}' already exists!`);
			return;
		}
		// Explanation why is not correct to put Array.push() method in setState() 
		// https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-reactjs				
		this.setState(prevState => ({
			movies: [...prevState.movies, movie], // React's way to automatically put safely new element into state array
			selectedMovie: null
		}));
	}

	updateMovie = (movie) => {
		// See how to update element in array
		// https://stackoverflow.com/questions/39889009/replace-object-in-array-on-react-state
		let moviesArr = [...this.state.movies];
		let idx = _.findIndex(this.state.movies, this.state.selectedMovie);

		if (idx < 1) {
			alert('Application error.');
			return;
		}		
		
		moviesArr[idx] = movie;
					
		this.setState({
			movies: moviesArr,
			selectedMovie: null,
			crudType: App.crudTypeEnum.CREATE
		});	
	}

	handleDeleteMovie = (e) => {
		e.stopPropagation();
		
		let parentDOMElement = e.currentTarget.parentNode;

		while (!parentDOMElement.dataset.movie) {
			if (parentDOMElement.tagName === 'BODY') {
				alert('Application error.')
				return;
			}

			parentDOMElement = parentDOMElement.parentNode;
		}

		let movie = parentDOMElement.dataset.movie;

		// See how to update element in array
		// https://stackoverflow.com/questions/39889009/replace-object-in-array-on-react-state
		let moviesArr = _.filter(this.state.movies, (o) => {
			return o.name != movie;
		});
					
		this.setState({
			movies: moviesArr,
			selectedMovie: null,
			crudType: App.crudTypeEnum.CREATE
		});	
	}

	handleMovieSelected = (e) => {
		if (e.currentTarget) {
			let selectedMovieText = e.currentTarget.dataset.movie;
			let wantedMovie = (movie) => movie.name === selectedMovieText;
	
			this.setState(prevState => ({
				selectedMovie: prevState.movies.find(wantedMovie),
				crudType: App.crudTypeEnum.UPDATE
			}));
		}	
	}

	getFormTitle = () => {
		switch (this.state.crudType) {			
			case App.crudTypeEnum.DELETE:
				return `Delete ${this.state.selectedMovie.name}`;
			case App.crudTypeEnum.UPDATE:
				return `Update ${this.state.selectedMovie.name}`;
			default:
				return 'Add movie'
		}
	}

	handleCreateClick = (e) => {
		this.setState({
			selectedMovie: null,
			crudType: App.crudTypeEnum.CREATE
		});
	}

  render() {
		const {
			selectedMovie,
			movies,
		} = this.state;

		let panelHeader = (<PanelHeader handleCreateClick={this.handleCreateClick}/>);
		let formTitle = this.getFormTitle();

    return (
      <div>
        <Row className="App App-header">                
					<h1 className="App-title">Film quiz</h1>
					{this.displayName}
        </Row>
        <div className="container" style={{padding: '20px'}}>
					<Row className="row">
						<Tabs defaultActiveKey={0} id="quiz-tabs" >
							<Tab eventKey={0} title={App.tabTitles[0]}> 	
								<Quiz movies={movies} />						
							</Tab>
							<Tab eventKey={1} title={App.tabTitles[1]}>
								<Col xs={12} sm={6} md={6} lg={5}>
									<Panel header={panelHeader}>
										<ListOfMovies movies={movies} 
											selectedMovie={selectedMovie} 
											handleMovieSelected={this.handleMovieSelected}
											handleDeleteMovie={this.handleDeleteMovie}/>
									</Panel>
								</Col>
								<Col xs={12} sm={6} md={6} lg={7}>									
									<MovieForm 
										movies={movies} 
										selectedMovie={selectedMovie} 
										getSubmittedData = {this.getSubmittedData}
										formTitle={formTitle} />
								</Col>			
							</Tab>
						</Tabs>
					</Row>
        </div>
      </div>      
    );
  }
}
