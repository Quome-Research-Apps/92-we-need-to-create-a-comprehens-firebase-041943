import CoursePage from "@/components/CoursePage";

export default function Page({ params }: { params: { id: string } }) {
    return <CoursePage courseId={params.id} />;
}
