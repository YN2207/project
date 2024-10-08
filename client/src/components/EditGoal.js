import React, { useState, useEffect } from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import { Button } from "@material-ui/core";

const EditGoal = (props) => {
  const { goalId } = props;

  const [goalText, setGoalText] = useState("");
  const [goalStatus, setGoalStatus] = useState("");
  const [targetFinishDate, setTargetFinishDate] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [errs, setErrs] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/goals/${goalId}`)
      .then((myGoal) => {
        console.log(myGoal.data);
        setGoalText(myGoal.data.goalText);
        setGoalStatus(myGoal.data.goalStatus);
        setTargetFinishDate(
          new Date(myGoal.data.targetFinishDate).toLocaleDateString("en-us")
        );
        setPictureUrl(myGoal.data.pictureUrl);
        setDescription(myGoal.data.description);
      })
      .catch((err) => {});
  }, [goalId]);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    console.log(userId);
  }, [userId]);

  const submitHandler = (event) => {
    event.preventDefault();
    axios
      .put(
        `http://localhost:8000/api/goals/${goalId}`,
        {
          goalText: goalText,
          goalStatus: goalStatus,
          targetFinishDate: targetFinishDate,
          pictureUrl: pictureUrl,
          description: description,
        },
        {
          withCredentials: true,
        }
      )
      .then((updatedGoal) => {
        if (updatedGoal.data.errors) {
          console.log(updatedGoal.data.errors);
          setErrs(updatedGoal.data.errors);
        } else {
          console.log(updatedGoal.data);
          navigate(`/goals/${updatedGoal.data._id}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h2>Edit Goal</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label>What is your goal? - CANNOT EDIT THIS</label>
          {errs.goalText ? (
            <span className='error-text'>{errs.goalText.message}</span>
          ) : null}
          <input type='text' name='goalText' value={goalText} readonly />
        </div>
        <div>
          <label>Enter your progress or goal status</label>
          {errs.goalStatus ? (
            <span className='error-text'>{errs.goalStatus.message}</span>
          ) : null}
          <input
            type='text'
            name='goalStatus'
            value={goalStatus}
            onChange={(e) => setGoalStatus(e.target.value)}
          />
        </div>
        <div>
          <label>Target Finish Date</label>
          {errs.targetFinishDate ? (
            <span className='error-text'>{errs.targetFinishDate.message}</span>
          ) : null}
          <input
            type='text'
            name='targetFinishDate'
            value={targetFinishDate}
            onChange={(e) => setTargetFinishDate(e.target.value)}
          />
        </div>
        <div>
          <label>URL of something that is inspiring you</label>
          <input
            type='text'
            name='pictureUrl'
            value={pictureUrl}
            onChange={(e) => setPictureUrl(e.target.value)}
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type='text'
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button variant='contained' color='primary' onClick={submitHandler}>
          Edit My Goal
        </Button>
      </form>
      <Button
        color='inherit'
        variant='outlined'
        onClick={() => navigate("/goals")}
      >
        See All Goals
      </Button>
    </div>
  );
};
export default EditGoal;
