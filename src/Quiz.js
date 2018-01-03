'use-strict'

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {Button, ListGroup, ListGroupItem, Panel, Row, Col, Image} from 'react-bootstrap'
import _ from 'lodash'

const Movies = (props) => {		
	let movies = props.movies
		.map((movie, idx) => {
			let bsStyle = null;
			if (idx === props.clickedIdx)	{
				bsStyle = props.isCorrect ? "success" : "danger";
			}

			return (										
				<ListGroupItem key={idx} 
					data-index={idx} 
					href="#" 
					onClick={props.handleMovieSelected} 
					bsStyle={ bsStyle }>
					{movie.name}
				</ListGroupItem>
			);					 
});		
	return (
		<ListGroup>
			{movies}
		</ListGroup>
	)
}

const ContinueButton = (props) => {
	return (				
		<Button bsStyle="success" className="" disabled={!props.isCorrect} onClick={props.handleContinueClick}>
			Continue
		</Button>				
	);
};

const PanelFooter = (props) => {
	return (
		<ContinueButton isCorrect={props.isCorrect} handleContinueClick={props.handleContinueClick} />
	);
}

const ResponseMessageDiv = (props) => {
	if (props.isCorrect) {
		return (
			<div className="row text-center">
				<h1 className="text-success">{props.responseMessage}</h1>
			</div>
		);
	}
	else if (props.isCorrect === false) {
		return (
			<div className="row text-center text-danger">
				<h1 className="text-danger">{props.responseMessage}</h1>
			</div>
		);
	}

	return null;
}

class Quiz extends React.Component {
	static propTypes = {
		movies: PropTypes.array,
		numberOfChoices: PropTypes.number,
	};

	static defaultProps = {
		numberOfChoices: 4,
	};

	static randomNumber = (to) => {
		return (Math.floor(Math.random() * (to)));
	};
	
	state = {
		isCorrect: null,
		currentMovieIdx: Quiz.randomNumber(this.props.numberOfChoices - 1),
		movies: [],
		responseMessage: null,
		clickedIdx: null,
	};

	constructor(props) {
		super(props);
		// Must initialize movies here because in state block function is not recognized
		this.state.movies = this.createRandomMovies();
	}

	createRandomMovies = () => {
		return (
			_.shuffle(_.range(0, this.props.movies.length))
				.slice(0, this.props.numberOfChoices).map((movieIndex, idx) => {
					return (this.props.movies[movieIndex]);
			}));
	}
	
	handleMovieSelected = (e) => {
		const clickedDOMElement = e.target;

		let selectedMovie = clickedDOMElement.text;	
		let correctAnswer = parseInt(clickedDOMElement.dataset.index) === this.state.currentMovieIdx;

		this.setState({
			responseMessage: correctAnswer ? 'Correct!' : 'Incorrect!',
			isCorrect: correctAnswer,
			clickedIdx: parseInt(clickedDOMElement.dataset.index),
		});
	}

	handleContinueClick = (e) => {
		if (!this.state.isCorrect) {
			return;
		}

		this.setState(prevState => ({
			isCorrect: null,
			currentMovieIdx: Quiz.randomNumber(this.props.numberOfChoices - 1),
			movies: this.createRandomMovies(),
			clickedIdx: null				
		}));
	}

	render () {
		const {
			movies,
			currentMovieIdx,
			isCorrect,
			clickedIdx,
			responseMessage
		} = this.state

		return (
			<div style={{padding: '20px'}}>
				<Panel bsStyle="info" header="Choose an answer" footer={<PanelFooter handleContinueClick={this.handleContinueClick} isCorrect={isCorrect} />} >
					<Row className={"text-center " + (isCorrect === null ? 'hidden' : '')}>
						<h1 className={isCorrect ? 'text-success' : 'text-danger'}>{responseMessage}</h1>
					</Row>
					<Row>
						<Col xs={12} sm={4} md={4} lg={4} className="text-center">
							<Image responsive="true" thumbnail="true"
								src={movies[currentMovieIdx].imageUrl} />
						</Col>
						<Col xs={12} sm={5} md={5} lg={5}>
							<Movies movies = {movies}
								handleMovieSelected = {this.handleMovieSelected}
								currentMovie={this.state}
								clickedIdx={clickedIdx}
								isCorrect={isCorrect} />														
						</Col>
					</Row>
				</Panel>
			</div>
		);
	};
}


export default Quiz;