import { ErrorMessageEnum } from '@/enums';
export function checkStatus(status: number, msg: string, errorMessageMode: Service.ErrorMessageMode = 'message'): void {
  let errMessage = '';
  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    case 401:
      errMessage = ErrorMessageEnum.ERR_MSG401;
      break;
    case 403:
      errMessage = ErrorMessageEnum.ERR_MSG403;
      break;
    // 404请求不存在
    case 404:
      errMessage = ErrorMessageEnum.ERR_MSG404;
      break;
    case 405:
      errMessage = ErrorMessageEnum.ERR_MSG405;
      break;
    case 408:
      errMessage = ErrorMessageEnum.ERR_MSG408;
      break;
    case 500:
      errMessage = ErrorMessageEnum.ERR_MSG500;
      break;
    case 501:
      errMessage = ErrorMessageEnum.ERR_MSG501;
      break;
    case 502:
      errMessage = ErrorMessageEnum.ERR_MSG502;
      break;
    case 503:
      errMessage = ErrorMessageEnum.ERR_MSG503;
      break;
    case 504:
      errMessage = ErrorMessageEnum.ERR_MSG504;
      break;
    case 505:
      errMessage = ErrorMessageEnum.ERR_MSG505;
      break;
    default:
  }

  if (errMessage) {
    if (errorMessageMode === 'modal') {
      window?.$message?.error(errMessage, {
        closable: true
      });
    } else if (errorMessageMode === 'message') {
      window?.$message?.error(errMessage);
    }
  }
}
