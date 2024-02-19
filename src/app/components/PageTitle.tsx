import style from "../page.module.css";

const PageTitle = ({ title }: { title: string }) => {
  return <h1 className={style.title}>{title}</h1>;
};

export default PageTitle;
