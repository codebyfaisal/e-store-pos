import dayjs from "dayjs";

function normalizeDate(dt, format = "YYYY-MM-DD") {
  // const date = dayjs(dt);
  // if (!date.isValid()) return "";
  // return date.format(format);

  // const date = dayjs(dt);
  // return !date.isValid() ? "" : date.format(format);

  return dayjs(dt).isValid() ? dayjs(dt).format(format) : "";
}

export default normalizeDate;
