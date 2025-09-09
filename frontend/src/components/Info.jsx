import React from "react";
import "../Info.css";

export default function Info() {
  return (
    <div className="page_wrapper">
      <header className="Info-header font-bold">
        <h1>Background and Information</h1>
      </header>
      <div className="content_wrapper">
        <div className="background_info">
          <p>
            In group discussions, classrooms, meetings, and media, studies have
            consistently shown that women and marginalized voices are often
            interrupted, spoken over, or given less speaking time than their
            male counterparts. While these imbalances are acknowledged, they are
            rarely measured in real time which makes it harder to hold systems
            accountable or spark meaningful change. By analyzing speech patterns
            and estimating gender presence in conversations, we can shine a
            light on who gets to speak and who doesn’t.
          </p>
        </div>

        <div className="resources">
          <p>
            Here are some resources that address the issue of women not being
            heard in tech:
          </p>
          <ul>
            <li>
              <a
                href="https://leanin.org/women-in-the-workplace"
                target="_blank"
                rel="noreferrer"
              >
                The State of Women in Tech and VC – McKinsey & LeanIn.org
              </a>
              – Annual report on representation and bias in the workplace.
            </li>

            <li>
              <a
                href="https://www.catalyst.org/research/the-double-bind-dilemma-for-women-in-leadership/"
                target="_blank"
                rel="noreferrer"
              >
                The Double Bind – Catalyst
              </a>
              – Explores how women leaders are penalized for being assertive.
            </li>

            <li>
              <a
                href="https://en.unesco.org/stem/girls"
                target="_blank"
                rel="noreferrer"
              >
                Solving the STEM Gender Gap – UNESCO
              </a>
              – Global data on underrepresentation of women’s voices in STEM.
            </li>

            <li>
              <a
                href="https://hbr.org/2012/05/why-women-dont-speak-up-at-work"
                target="_blank"
                rel="noreferrer"
              >
                When Women Don’t Speak – Harvard Business Review
              </a>
              – Insights into meeting dynamics that silence women.
            </li>

            <li>
              <a
                href="https://www.theatlantic.com/magazine/archive/2014/05/the-confidence-gap/359815/"
                target="_blank"
                rel="noreferrer"
              >
                The Confidence Gap – The Atlantic
              </a>
              – How confidence affects who gets heard in tech and leadership.
            </li>

            <li>
              <a
                href="https://www.bbc.com/worklife/article/20200306-why-women-dont-get-heard-at-work"
                target="_blank"
                rel="noreferrer"
              >
                Why Women Don’t Get Heard at Work – BBC Worklife
              </a>
              – Research on interruptions and social bias in conversations.
            </li>

            <li>
              <a
                href="https://www.youtube.com/watch?v=2U-tOghblfE"
                target="_blank"
                rel="noreferrer"
              >
                The Hidden Influence of Social Networks – Nicholas Christakis |
                TED
              </a>
              – How influence and bias play out in group dynamics.
            </li>

            <li>
              <a
                href="https://www.ted.com/talks/adam_galinsky_how_to_speak_up_for_yourself"
                target="_blank"
                rel="noreferrer"
              >
                How to Speak Up for Yourself – Adam Galinsky | TED
              </a>
              – Practical strategies for being heard.
            </li>

            <li>
              <a
                href="https://www.ted.com/talks/sheryl_sandberg_why_we_have_too_few_women_leaders"
                target="_blank"
                rel="noreferrer"
              >
                Why We Have Too Few Women Leaders – Sheryl Sandberg | TED
              </a>
              – A classic TED Talk on leadership bias in tech.
            </li>

            <li>
              <a href="https://www.ncwit.org/" target="_blank" rel="noreferrer">
                NCWIT (National Center for Women & Information Technology)
              </a>
              – Research and toolkits supporting women in computing.
            </li>

            <li>
              <a
                href="https://www.hiretechladies.com/"
                target="_blank"
                rel="noreferrer"
              >
                Tech Ladies
              </a>
              – Community and job board supporting women in tech.
            </li>

            <li>
              <a href="https://anitab.org/" target="_blank" rel="noreferrer">
                AnitaB.org
              </a>
              – Organizers of Grace Hopper Celebration; champions women and
              nonbinary voices in tech.
            </li>

            <li>
              <a
                href="http://sheplusplus.org/"
                target="_blank"
                rel="noreferrer"
              >
                She++
              </a>
              – Youth-driven movement empowering women in tech.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
