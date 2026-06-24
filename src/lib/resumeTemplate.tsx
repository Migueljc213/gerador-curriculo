import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CurriculoPayload } from './types';

const C = {
  dark: '#0f172a',
  blue: '#2563eb',
  body: '#1e293b',
  muted: '#64748b',
  white: '#ffffff',
  divider: '#e2e8f0',
  headerSub: '#94a3b8',
  headerContact: '#cbd5e1',
};

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: C.white,
    fontSize: 9,
    color: C.body,
  },
  header: {
    backgroundColor: C.dark,
    paddingHorizontal: 40,
    paddingTop: 30,
    paddingBottom: 22,
  },
  headerName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    color: C.white,
    letterSpacing: 1,
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 10,
    color: C.headerSub,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  headerContactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerContactItem: {
    fontSize: 8,
    color: C.headerContact,
    marginRight: 18,
    marginBottom: 2,
  },
  content: {
    paddingHorizontal: 40,
    paddingTop: 22,
    paddingBottom: 36,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sectionAccent: {
    width: 3,
    height: 11,
    backgroundColor: C.blue,
    borderRadius: 2,
    marginRight: 7,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: C.dark,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  sectionDivider: {
    height: 0.75,
    backgroundColor: C.divider,
    marginBottom: 9,
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.65,
    color: C.body,
    textAlign: 'justify',
  },
  expBlock: {
    marginBottom: 10,
  },
  expTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  expCompany: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: C.dark,
  },
  expDate: {
    fontSize: 8,
    color: C.muted,
    marginTop: 1,
  },
  expRole: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 8.5,
    color: C.blue,
    marginBottom: 5,
  },
  expSeparator: {
    height: 0.5,
    backgroundColor: C.divider,
    marginVertical: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingRight: 4,
  },
  bulletDot: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: C.blue,
    marginRight: 5,
    marginTop: 1.5,
  },
  bulletText: {
    fontSize: 8.5,
    lineHeight: 1.55,
    color: C.body,
    flex: 1,
  },
  projectBlock: {
    marginBottom: 8,
  },
  projectTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: C.dark,
    marginBottom: 2,
  },
  projectDesc: {
    fontSize: 8.5,
    lineHeight: 1.55,
    color: C.body,
    textAlign: 'justify',
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  skillLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: C.dark,
    width: 88,
    paddingTop: 1,
  },
  skillValue: {
    fontSize: 8,
    lineHeight: 1.55,
    color: C.body,
    flex: 1,
  },
  eduBlock: {
    marginBottom: 7,
  },
  eduTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eduTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: C.dark,
  },
  eduDate: {
    fontSize: 8,
    color: C.muted,
    marginTop: 1,
  },
  eduInstitution: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 8.5,
    color: C.blue,
    marginTop: 1,
  },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <View style={s.sectionTitleRow}>
        <View style={s.sectionAccent} />
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      <View style={s.sectionDivider} />
      {children}
    </View>
  );
}

function ExpBlock({
  company, role, date, bullets, separator = false,
}: {
  company: string; role: string; date: string; bullets: string[]; separator?: boolean;
}) {
  return (
    <View wrap={false}>
      {separator && <View style={s.expSeparator} />}
      <View style={s.expBlock}>
        <View style={s.expTopRow}>
          <Text style={s.expCompany}>{company}</Text>
          <Text style={s.expDate}>{date}</Text>
        </View>
        <Text style={s.expRole}>{role}</Text>
        {bullets.map((b, i) => (
          <View key={i} style={s.bulletRow}>
            <Text style={s.bulletDot}>▸</Text>
            <Text style={s.bulletText}>{b}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SkillRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.skillRow}>
      <Text style={s.skillLabel}>{label}:</Text>
      <Text style={s.skillValue}>{value}</Text>
    </View>
  );
}

export function buildCurriculoDocument(payload: CurriculoPayload) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header} fixed>
          <Text style={s.headerName}>JOSÉ MIGUEL CARDOZO</Text>
          <Text style={s.headerTitle}>Desenvolvedor Full-Stack Júnior</Text>
          <View style={s.headerContactRow}>
            <Text style={s.headerContactItem}>migueljccardozo@gmail.com</Text>
            <Text style={s.headerContactItem}>+55 (24) 99973-6248</Text>
            <Text style={s.headerContactItem}>github.com/Migueljc123</Text>
            <Text style={s.headerContactItem}>linkedin.com/in/miguel-cardozo</Text>
            <Text style={s.headerContactItem}>Rio de Janeiro, RJ</Text>
          </View>
        </View>

        <View style={s.content}>
          <Section title="Resumo Profissional">
            <Text style={s.summaryText}>{payload.resumo}</Text>
          </Section>

          <Section title="Experiência Profissional">
            <ExpBlock
              company="Frog Summit"
              role="Desenvolvedor Júnior Full-Stack"
              date="Mar/2025 – Presente"
              bullets={payload.exp_frog_bullets}
            />
            <ExpBlock
              company="Brasmid Startup"
              role="Desenvolvedor Júnior Full-Stack"
              date="Mai/2024 – Dez/2025"
              bullets={payload.exp_brasmid_bullets}
              separator
            />
            <ExpBlock
              company="Projeto AAP-VR"
              role="Liderança Técnica e Mentoria"
              date="Jan/2024 – Abr/2024"
              bullets={payload.exp_aapvr_bullets}
              separator
            />
          </Section>

          <Section title="Projetos de Destaque">
            {payload.projetos_destaque.map((p, i) => (
              <View key={i} style={s.projectBlock} wrap={false}>
                <Text style={s.projectTitle}>{p.titulo}</Text>
                <Text style={s.projectDesc}>{p.descricao}</Text>
              </View>
            ))}
          </Section>

          <Section title="Habilidades Técnicas">
            <SkillRow label="Back-End"       value={payload.hab_back} />
            <SkillRow label="Front-End"      value={payload.hab_front} />
            <SkillRow label="Banco de Dados" value={payload.hab_db} />
            <SkillRow label="DevOps"         value={payload.hab_devops} />
            <SkillRow label="Arquitetura"    value={payload.hab_arq} />
            <SkillRow label="Segurança"      value={payload.hab_seg} />
          </Section>

          <Section title="Formação Acadêmica">
            <View style={s.eduBlock}>
              <View style={s.eduTopRow}>
                <Text style={s.eduTitle}>Bacharelado em Sistemas para Internet</Text>
                <Text style={s.eduDate}>Previsão: Jul/2026</Text>
              </View>
              <Text style={s.eduInstitution}>FAETERJ</Text>
            </View>
            <View style={s.eduBlock}>
              <View style={s.eduTopRow}>
                <Text style={s.eduTitle}>Formação Full-Stack Developer</Text>
                <Text style={s.eduDate}>Mai/2024 – Mar/2025</Text>
              </View>
              <Text style={s.eduInstitution}>Escola DNC</Text>
            </View>
          </Section>
        </View>
      </Page>
    </Document>
  );
}
