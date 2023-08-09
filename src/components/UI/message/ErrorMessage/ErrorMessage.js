import classes from './ErrorMessage.module.scss';
import {NavLink} from "react-router-dom";

export default function ErrorMessage({error, className,linkText,linkUrl}){
  let cls = [classes.wrapper]
  if(className) cls.push(className)

  return (
      <div className={cls.join(" ")}>
          <div className={classes.icon}></div>
          <div className={classes.text}>
              {error}
              {linkText?<div className={classes.link_wrap}><NavLink className={classes.link} to={linkUrl}>{linkText}</NavLink></div>:''}
          </div>
      </div>
  )
}