import classes from './RequisitesStatus.module.scss';

export default function RequisitesStatus({ status, statusRequisites }) { // TODO: Отрефачить (написано тупо)

  let cls;
  let text;
  let clsRequisites;
  let textRequites;

  switch (status) {
    case 3:
      cls = classes.canceled
      text = "Отказано в привязке к объекту"
      break;
    case 1:
    case 2:
      cls = classes.checking
      text = "Выполняется проверка"
      break;
    case 4:
      cls = classes.approved
      text = "Одобрено"
      break;
    default:
      break;
  }
  switch (statusRequisites) {
    case 3:
      clsRequisites = classes.canceled
      textRequites = "Отказано"
      break;
    case 1:
    case 2:
      clsRequisites = classes.checking
      textRequites = "Выполняется проверка"
      break;
    case 4:
      clsRequisites = classes.approved
      textRequites = "Одобрено"

      break;
    default:
      break;
  }
  return (
    <>
      {statusRequisites && <div className={clsRequisites}>
        Статус проверки реквизитов: {textRequites}
      </div>}
      {status && <div className={cls}>
        Статус привязки к объекту: {text}
      </div>}
    </>
  )
}