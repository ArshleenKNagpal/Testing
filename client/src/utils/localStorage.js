export const getSavedGoalIds = () => {
  const savedGoalIds = localStorage.getItem('saved_goals')
    ? JSON.parse(localStorage.getItem('saved_goals'))
    : [];

  return savedGoalIds;
};

export const saveGoalIds = (goalIdArr) => {
  if (goalIdArr.length) {
    localStorage.setItem('saved_goals', JSON.stringify(goalIdArr));
  } else {
    localStorage.removeItem('saved_goals');
  }
};

export const removeGoalId = (goalId) => {
  const savedGoalIds = localStorage.getItem('saved_goals')
    ? JSON.parse(localStorage.getItem('saved_goals'))
    : null;

  if (!savedGoalIds) {
    return false;
  }

  const updatedSavedGoalIds = savedGoalIds?.filter((savedGoalId) => savedGoalId !== goalId);
  localStorage.setItem('saved_goals', JSON.stringify(updatedSavedGoalIds));

  return true;
};
