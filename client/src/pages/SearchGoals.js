import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';
import { saveGoal, searchGoogleGoals } from '../utils/API';
import { saveGoalIds, getSavedGoalIds } from '../utils/localStorage';

const SearchGoals = () => {
  // create state for holding returned google api data
  const [searchedGoals, setSearchedGoals] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved goalId values
  const [savedGoalIds, setSavedGoalIds] = useState(getSavedGoalIds());

  // set up useEffect hook to save `savedGoalIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveGoalIds(savedGoalIds);
  });

  // create method to search for goals and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleGoals(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const goalData = items.map((goal) => ({
        goalId: goal.id,
        authors: goal.volumeInfo.authors || ['No author to display'],
        title: goal.volumeInfo.title,
        description: goal.volumeInfo.description,
        image: goal.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedGoals(goalData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a goal to our database
  const handleSaveGoal = async (goalId) => {
    // find the goal in `searchedGoals` state by the matching id
    const goalToSave = searchedGoals.find((goal) => goal.goalId === goalId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveGoal(goalToSave, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      // if goal successfully saves to user's account, save goal id to state
      setSavedGoalIds([...savedGoalIds, goalToSave.goalId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Goals!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a goal'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedGoals.length
            ? `Viewing ${searchedGoals.length} results:`
            : 'Search for a goal to begin'}
        </h2>
        <CardColumns>
          {searchedGoals.map((goal) => {
            return (
              <Card key={goal.goalId} border='dark'>
                {goal.image ? (
                  <Card.Img src={goal.image} alt={`The cover for ${goal.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{goal.title}</Card.Title>
                  <p className='small'>Authors: {goal.authors}</p>
                  <Card.Text>{goal.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedGoalIds?.some((savedGoalId) => savedGoalId === goal.goalId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveGoal(goal.goalId)}>
                      {savedGoalIds?.some((savedGoalId) => savedGoalId === goal.goalId)
                        ? 'This goal has already been saved!'
                        : 'Save this Goal!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchGoals;
