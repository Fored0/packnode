const getTime = {
  getYMDHMS: (timestamp) => {
    let time = new Date(timestamp * 1);
    let year = time.getFullYear();
    let month = (time.getMonth() + 1).toString();
    let date = time.getDate().toString();
    let hours = time.getHours().toString();
    let minute = time.getMinutes().toString();
    let second = time.getSeconds().toString();

    if (parseInt(month) < 10) {
      month = '0' + month;
    }
    if (parseInt(date) < 10) {
      date = '0' + date;
    }
    if (parseInt(hours) < 10) {
      hours = '0' + hours;
    }
    if (parseInt(minute) < 10) {
      minute = '0' + minute;
    }
    if (parseInt(second) < 10) {
      second = '0' + second;
    }
    return year + '-' + month + '-' + date + '-' + hours + '-' + minute + '-' + second;
  }
}
export default getTime