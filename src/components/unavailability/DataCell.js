import React from 'react';
export default function DataCell(props) {
  function isUnavailable(date) {
    const localeDate = date.toLocaleDateString();
    return props.data.filter(item => {
      let day = new Date(item)
      return day.toLocaleDateString() === localeDate;
    }).length > 0;
  }
  const { startDate, text } = props.itemData;
  // const isDisableDate = isUnavailable(startDate);
  const isDisableDate = true;

  const cssClasses = [];

  if(isDisableDate) {
    cssClasses.push('disable-date');
  } 
  return (
    <div className={cssClasses}>
      {text}
    </div>
  );
}
