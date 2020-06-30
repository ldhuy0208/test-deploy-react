import React from 'react'
import './Cell.scss'
function Cell(props) {
  const openClass = props.isOpen && "open"; 
  return (
    <div className={"cell " + openClass} onClick={props.onOpen} onContextMenu={props.onOpen}>
      
      {(props.totalBoom !== null && props.totalBoom !== 0) ? props.totalBoom : props.isFlag ? 'F': ''}

      {props.isBoom && 'B'}
    </div>
  )
}

export default Cell
