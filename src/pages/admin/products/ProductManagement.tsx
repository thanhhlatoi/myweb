import { ArrowRight, BadgeDollarSign, Mail, ShieldCheck, Smartphone, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const productLayouts = [
  {
    title: "Nick GG Adsense",
    description: "Quản lý nick Google Adsense, trạng thái live, quốc gia, giá bán và ghi chú verify.",
    path: "/admin/products/adsense",
    icon: BadgeDollarSign,
    gradient: "from-slate-950 via-amber-950 to-yellow-600",
    metric: "186 nick",
    subMetric: "142 nick live",
    tag: "Adsense",
  },
  {
    title: "ViOTP",
    description: "Theo dõi dịch vụ thuê số OTP, giá theo service, trạng thái API và tỉ lệ thành công.",
    path: "/admin/products/viotp",
    icon: Smartphone,
    gradient: "from-emerald-950 via-teal-900 to-cyan-600",
    metric: "24 service",
    subMetric: "96% success rate",
    tag: "OTP Gateway",
  },
  {
    title: "Gmail",
    description: "Quản lý kho Gmail theo quốc gia, loại trust, số lượng tồn, giá bán và trạng thái cấp phát.",
    path: "/admin/products/gmail",
    icon: Mail,
    gradient: "from-slate-950 via-blue-950 to-red-600",
    metric: "4,820 gmail",
    subMetric: "3 quốc gia",
    tag: "Gmail Stock",
  },
];

export default function ProductManagement() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-violet-950 to-blue-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-200">Product Layouts</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Chọn nhóm sản phẩm để quản lý</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Mỗi nhóm sản phẩm có một màn quản lý riêng để dễ theo dõi tồn kho, giá bán, trạng thái và thao tác vận hành.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-sm text-slate-300">Tổng nhóm sản phẩm</p>
            <strong className="mt-1 block text-3xl">{productLayouts.length}</strong>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {productLayouts.map((layout) => {
          const Icon = layout.icon;

          return (
            <button
              key={layout.title}
              type="button"
              onClick={() => navigate(layout.path)}
              className="group overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`bg-gradient-to-r ${layout.gradient} p-6 text-white`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                    <Icon size={28} />
                  </div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {layout.tag}
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-bold">{layout.title}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-200">{layout.description}</p>
              </div>

              <div className="p-6">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Quy mô</p>
                    <strong className="mt-1 block text-xl text-slate-950">{layout.metric}</strong>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Tình trạng</p>
                    <strong className="mt-1 block text-xl text-blue-600">{layout.subMetric}</strong>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <ShieldCheck size={17} />
                    Sẵn sàng quản lý
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-blue-600">
                    Quản lý
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Doanh thu ước tính</p>
          <strong className="mt-3 block text-2xl text-slate-950">312M</strong>
          <p className="mt-2 flex items-center gap-1 text-sm text-emerald-600"><TrendingUp size={16} /> +14.6% tháng này</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tổng item đang bán</p>
          <strong className="mt-3 block text-2xl text-blue-600">5,030</strong>
          <p className="mt-2 text-sm text-slate-500">Bao gồm Adsense, OTP, Gmail</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Cần kiểm tra</p>
          <strong className="mt-3 block text-2xl text-amber-600">18</strong>
          <p className="mt-2 text-sm text-slate-500">Tồn kho thấp hoặc cần verify</p>
        </div>
      </section>
    </div>
  );
}
