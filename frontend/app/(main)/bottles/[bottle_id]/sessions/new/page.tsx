export default async function NewSessionPage({
  params,
}: {
  params: Promise<{ bottle_id: string }>;
}) {
  const { bottle_id } = await params;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">セッション追加</h1>
      <p className="text-sm text-zinc-400">ボトルID: {bottle_id}（実装予定）</p>
    </div>
  );
}
