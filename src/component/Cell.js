import React from 'react'
import './Cell.scss'
function Cell(props) {
  const openClass = props.totalBoom !== null && props.totalBoom === 0 && "open"; 
  return (
    <div className={"cell " + openClass} onClick={props.onOpen} onContextMenu={props.onOpen}>

      {(props.totalBoom !== null && props.totalBoom !== 0) ? props.totalBoom : props.isFlag ? 'F': ''}

    </div>
  )
}

export default Cell
