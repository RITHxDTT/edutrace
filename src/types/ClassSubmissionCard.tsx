

type Props = {
  late:number;
  submitted:number;
  total:number;
  className:string;
}

export default function ClassSubmissionCard({
 late,
 submitted,
 total,
 className
}:Props){

 return(
   <div className="rounded-xl p-4 bg-white">
      <h3>{className}</h3>

      <p>Submitted: {submitted}</p>

      <p>Late: {late}</p>

      <p>Total: {total}</p>
   </div>
 )
}